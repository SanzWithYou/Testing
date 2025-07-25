<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Session Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default session "driver" that will be utilized
    | by Laravel. By default, we will use the lightweight "file" driver which
    | works well for most applications. You may also specify a database driver.
    |
    */

    'driver' => env('SESSION_DRIVER', 'file'),

    /*
    |--------------------------------------------------------------------------
    | Session Lifetime
    |--------------------------------------------------------------------------
    |
    | Here you may specify the number of minutes that the session should be
    | allowed to remain idle before it expires. If you want them to
    | expire immediately upon browser closing, set that option.
    |
    */

    'lifetime' => env('SESSION_LIFETIME', 120),

    'expire_on_close' => false,

    /*
    |--------------------------------------------------------------------------
    | Session Encryption
    |--------------------------------------------------------------------------
    |
    | This option allows you to easily specify that all of your session data
    | should be encrypted before it's stored. All encryption is performed
    | automatically by Laravel and you can use the session as you normally do.
    |
    */

    'encrypt' => env('SESSION_ENCRYPT', false),

    /*
    |--------------------------------------------------------------------------
    | Session File Location
    |--------------------------------------------------------------------------
    |
    | When using the "file" session driver, we need a location where files may
    | be stored. A default has been provided, but you may change the place
    | where your session files are stored on disk here.
    |
    */

    'files' => storage_path('framework/sessions'),

    /*
    |--------------------------------------------------------------------------
    | Session Database Connection
    |--------------------------------------------------------------------------
    |
    | When using the "database" session driver, you may specify the connection
    | that should be used to store your sessions. When this is null, the
    | default database connection will be used for session storage.
    |
    */

    'connection' => env('SESSION_CONNECTION'),

    /*
    |--------------------------------------------------------------------------
    | Session Database Table
    |--------------------------------------------------------------------------
    |
    | When using the "database" session driver, you may specify the table that
    | should be used to store your sessions. Of course, a default value has
    | been setup for you, but you are free to change this parameter here.
    |
    */

    'table' => 'sessions',

    /*
    |--------------------------------------------------------------------------
    | Session Sweeping Lottery
    |--------------------------------------------------------------------------
    |
    | Some session drivers must manually sweep away old sessions. Here are the
    | chances (in percentages) for each request to run the session "sweep"
    | ending to remove old sessions from storage. A low percentage is preferred.
    |
    */

    'lottery' => [2, 100],

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Name
    |--------------------------------------------------------------------------
    |
    | Here you may change the name of the cookie used to maintain your session
    | ID. The name specified here will be used when Laravel needs to retrieve
    | the session ID cookie. You may change this value as desired.
    |
    */

    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Path
    |--------------------------------------------------------------------------
    |
    | The session cookie path determines the path for which the cookie will
    | be regarded as available. Typically, this will be the root path of
    | your application but you are free to change this value if you desired.
    |
    */

    'path' => '/',

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Domain
    |--------------------------------------------------------------------------
    |
    | Here you may change the domain of the cookie used to maintain your
    | session in Laravel. This greatly improves security and protects against
    | XSS attacks, but it also must be set to the domain for your app.
    |
    */

    'domain' => env('SESSION_DOMAIN', null), // <-- Sudah diatur ke null via .env.

    /*
    |--------------------------------------------------------------------------
    | HTTPS Only Cookies
    |--------------------------------------------------------------------------
    |
    | By default, cookies will only be sent over HTTPS connections if this
    | value is set to true. This will prevent the cookie from being sent to
    | the browser when the application is served over an insecure HTTP link.
    |
    */

    'secure' => env('SESSION_SECURE_COOKIE', null), // <-- Sudah diatur ke null via .env.

    /*
    |--------------------------------------------------------------------------
    | HTTP Access Only
    |--------------------------------------------------------------------------
    |
    | Setting this value to true will prevent JavaScript from accessing the
    | value of the cookie via the document.cookie property. This will help
    | mitigate the risks of cross-site scripting attacks on your application.
    |
    */

    'http_only' => true,

    /*
    |--------------------------------------------------------------------------
    | Same-Site Cookie Configuration
    |--------------------------------------------------------------------------
    |
    | This option determines how your cookies behave when cross-site requests
    | are made. The default value of "lax" provides a good balance between
    | security and convenience. You may want to configure this value.
    |
    | For SPA, especially during local development with different ports,
    | 'lax' can prevent cookies from being sent. 'null' or 'none' (with secure)
    | are often necessary for cross-origin local development setups.
    |
    | Options: 'lax', 'strict', 'none', or null
    |
    */

    'same_site' => env('SESSION_SAMESITE', null), // <-- TELAH DIUBAH! default menjadi null

];