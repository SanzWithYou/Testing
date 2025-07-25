<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller; // <-- TAMBAHKAN BARIS INI
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductStatus;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ProductController extends Controller
{
    // fetchProducts
    public function index(Request $request)
    {
        $query = Product::with('seller');

        // Filters
        if ($request->has('filters')) {
            $filters = json_decode($request->input('filters'), true); // Decode JSON string
            if (isset($filters['searchTerm'])) {
                $query->where(function($q) use ($filters) {
                    $q->where('name', 'like', '%' . $filters['searchTerm'] . '%')
                      ->orWhere('description', 'like', '%' . $filters['searchTerm'] . '%');
                });
            }
            if (isset($filters['categories']) && is_array($filters['categories'])) {
                $query->whereIn('category', $filters['categories']);
            }
            if (isset($filters['priceRange']) && is_array($filters['priceRange']) && count($filters['priceRange']) == 2) {
                $query->whereBetween('price', $filters['priceRange']);
            }
        }

        // Status filter (should only show available for public view)
        $query->where('status', ProductStatus::Available->value);
        
        // Sorting
        if ($request->has('sort')) {
            switch ($request->input('sort')) {
                case 'price_asc':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $query->orderBy('price', 'desc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'newest':
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        }

        $limit = $request->input('limit', 10);
        $products = $query->paginate($limit);

        return response()->json([
            'data' => $products->map(function ($product) {
                return $this->formatProductForFrontend($product);
            }),
            'total' => $products->total(),
            'hasMore' => $products->hasMorePages(),
        ]);
    }

    // fetchProductById
    public function show(Product $product)
    {
        $product->load('seller'); // Load seller data

        // Jika produk SOLD dan bukan seller/admin yang melihat, informasi sensitif tidak ditampilkan (ini bisa lebih kompleks)
        if ($product->status == ProductStatus::Sold && (auth()->guest() || (auth()->user()->id != $product->seller_id && !auth()->user()->isAdmin()))) {
            return response()->json($this->formatProductForFrontend($product, false));
        }
        
        return response()->json($this->formatProductForFrontend($product, true));
    }

    // Seller API: indexSellerProducts
    public function indexSellerProducts(User $user) // $user adalah seller ID yang dikirim frontend
    {
        // Otorisasi: Hanya user yang login yang merupakan $user, atau admin
        if (auth()->id() !== $user->id && (!auth()->user() || !auth()->user()->isAdmin())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $products = Product::where('seller_id', $user->id)
            ->with('seller')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($products->map(function ($product) {
            return $this->formatProductForFrontend($product, true); // true karena ini untuk seller
        }));
    }

    // Seller API: addProduct
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'category' => 'required|string|max:255',
                'sub_category' => 'nullable|string|max:255', // Opsional
                'price' => 'required|numeric|min:1000',
                'description' => 'nullable|string',
                'image' => 'required|image|max:2048', // Max 2MB
                'account_username' => 'nullable|string|max:255',
                'account_password' => 'nullable|string|max:255',
                'is_email_verified' => 'boolean',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('product_images', 'public');
        }

        $product = Product::create([
            'seller_id' => auth()->id(), // Seller adalah user yang sedang login
            'name' => $request->name,
            'category' => $request->category,
            'sub_category' => $request->sub_category,
            'price' => $request->price,
            'description' => $request->description,
            'image_url' => $imagePath ? Storage::url($imagePath) : null,
            'status' => ProductStatus::Available->value,
            'account_username' => $request->account_username,
            'account_password' => $request->account_password,
            'is_email_verified' => $request->boolean('is_email_verified'),
        ]);

        return response()->json($this->formatProductForFrontend($product, true), 201);
    }

    // Seller API: updateProduct (menggunakan POST dengan _method 'PUT')
    public function update(Request $request, Product $product)
    {
        // Otorisasi: Hanya seller pemilik atau admin yang bisa update
        if (auth()->id() !== $product->seller_id && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'category' => 'sometimes|required|string|max:255',
                'sub_category' => 'nullable|string|max:255',
                'price' => 'sometimes|required|numeric|min:1000',
                'description' => 'nullable|string',
                'image' => 'nullable|image|max:2048', // Opsional untuk upload gambar
                'status' => ['sometimes', 'required', Rule::in(['available', 'sold'])],
                'account_username' => 'nullable|string|max:255',
                'account_password' => 'nullable|string|max:255',
                'is_email_verified' => 'boolean',
            ]);
        } catch (ValidationException $e) {
            return response()->json(['message' => 'Validasi gagal', 'errors' => $e->errors()], 422);
        }

        $productData = $request->except(['_method', 'image']); // Ambil semua kecuali _method dan image

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($product->image_url) {
                $oldImagePath = str_replace(Storage::url(''), '', $product->image_url);
                Storage::disk('public')->delete($oldImagePath);
            }
            $imagePath = $request->file('image')->store('product_images', 'public');
            $productData['image_url'] = Storage::url($imagePath);
        } elseif ($request->has('image_url') && $request->input('image_url') === null) {
            // Handle case where frontend explicitly requests to remove image
            if ($product->image_url) {
                $oldImagePath = str_replace(Storage::url(''), '', $product->image_url);
                Storage::disk('public')->delete($oldImagePath);
            }
            $productData['image_url'] = null;
        }

        $product->update($productData);

        return response()->json($this->formatProductForFrontend($product, true));
    }

    // Seller API: deleteProduct
    public function destroy(Product $product)
    {
        // Otorisasi: Hanya seller pemilik atau admin yang bisa delete
        if (auth()->id() !== $product->seller_id && !auth()->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Hapus gambar dari storage
        if ($product->image_url) {
            $imagePath = str_replace(Storage::url(''), '', $product->image_url);
            Storage::disk('public')->delete($imagePath);
        }

        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }

    /**
     * Helper to format product data for frontend.
     * Includes sensitive data if $includeSensitiveData is true or if it's the seller/admin.
     */
    protected function formatProductForFrontend(Product $product, bool $includeSensitiveData = false): array
    {
        $seller = $product->seller;
        $formattedProduct = [
            'id' => $product->id,
            'name' => $product->name,
            'category' => $product->category,
            'sub_category' => $product->sub_category,
            'price' => (float) $product->price, // Pastikan float
            'description' => $product->description,
            'image_url' => $product->image_url,
            'seller_id' => $seller->id,
            'seller_name' => $seller->name,
            'seller_rating' => (float) $seller->products()->avg('rating') ?? 5.0, // Asumsi ada kolom rating di product (atau di testimonial)
            'status' => $product->status->value,
            'created_at' => $product->created_at->toISOString(),
        ];

        // Only include sensitive account data if specifically requested (e.g., by seller/admin or after purchase)
        if ($includeSensitiveData) {
            $formattedProduct['account_username'] = $product->account_username;
            $formattedProduct['account_password'] = $product->account_password;
            $formattedProduct['is_email_verified'] = $product->is_email_verified; // Boolean
        } else {
            // Null out sensitive data for public view
            $formattedProduct['account_username'] = null;
            $formattedProduct['account_password'] = null;
            $formattedProduct['is_email_verified'] = false;
        }

        return $formattedProduct;
    }
}