import React from 'react';
import Accordion from '../Accordion';

const faqs = [
    {
        q: 'Bagaimana cara kerja Sistem Escrow di SANZ STORE?',
        a: 'Sistem Escrow kami bertindak sebagai pihak ketiga yang netral. Saat Anda membeli, dana Anda kami simpan dengan aman. Dana baru akan diteruskan ke penjual setelah Anda mengonfirmasi bahwa akun yang diterima sudah sesuai dan aman.'
    },
    {
        q: 'Apakah aman membeli akun di sini?',
        a: 'Sangat aman. Kami memverifikasi setiap penjual dan memberikan garansi pada setiap transaksi melalui sistem Escrow. Tim kami juga siap membantu jika terjadi masalah.'
    },
    {
        q: 'Berapa lama proses pembelian akun?',
        a: 'Biasanya sangat cepat. Setelah pembayaran Anda terkonfirmasi, detail akun akan segera tersedia di halaman pesanan Anda. Anda bisa langsung mengaksesnya dalam hitungan menit.'
    },
    {
        q: 'Bagaimana jika saya mengalami masalah dengan akun yang dibeli?',
        a: 'Jangan khawatir. Segera hubungi customer support kami melalui live chat atau email. Kami akan memediasi masalah antara Anda dan penjual untuk menemukan solusi terbaik, termasuk kemungkinan pengembalian dana jika syarat terpenuhi.'
    },
];

const FaqSection: React.FC = () => {
    return (
        <section className="container mx-auto px-4 animate-fade-in">
             <h2 className="text-3xl md:text-4xl font-bold text-center text-white">Pertanyaan Umum (FAQ)</h2>
             <p className="text-center text-slate-400 mt-2 mb-12">Jawaban cepat untuk pertanyaan paling umum dari para pengguna.</p>

             <div className="max-w-3xl mx-auto bg-slate-800/20 backdrop-blur-md rounded-xl ring-1 ring-white/10 p-4 md:p-8">
                 {faqs.map((faq, index) => (
                     <Accordion key={index} title={faq.q}>
                         <p>{faq.a}</p>
                     </Accordion>
                 ))}
             </div>
        </section>
    );
};

export default FaqSection;
