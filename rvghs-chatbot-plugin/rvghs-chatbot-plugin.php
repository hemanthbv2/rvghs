<?php
/**
 * Plugin Name: RVGHS Chatbot
 * Plugin URI: https://rvghs.edu.in
 * Description: Interactive AI Chatbot for RV Girls High School with Dual-Write Telemetry (WordPress MySQL + Vercel MongoDB Command Center).
 * Version: 2.5.0
 * Author: Hemanth BV
 * Author URI: https://rvghs.edu.in
 * License: GPL-2.0+
 * Text Domain: rvghs-chatbot
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

// Define Constants
define('RVGHS_CHATBOT_VERSION', '2.5.0');
define('RVGHS_CHATBOT_DIR_PATH', plugin_dir_path(__FILE__));
define('RVGHS_CHATBOT_DIR_URL', plugin_dir_url(__FILE__));

/**
 * =========================================================================
 * 1. DATABASE ACTIVATION & AUTO-CREATION HOOKS
 * =========================================================================
 */
function rvghs_chatbot_activate() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    $table_interactions = $wpdb->prefix . 'rvghs_interactions';
    $table_leads = $wpdb->prefix . 'rvghs_leads';

    $sql_interactions = "CREATE TABLE $table_interactions (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        session_id varchar(100) NOT NULL,
        event_type varchar(100) NOT NULL,
        interaction_id varchar(255) DEFAULT '',
        query_text text,
        meta_data longtext,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        KEY session_id (session_id),
        KEY event_type (event_type)
    ) $charset_collate;";

    $sql_leads = "CREATE TABLE $table_leads (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        session_id varchar(100) NOT NULL,
        lead_data longtext,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        KEY session_id (session_id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql_interactions);
    dbDelta($sql_leads);
}
register_activation_hook(__FILE__, 'rvghs_chatbot_activate');

/**
 * Self-healing DB check: Ensures tables exist dynamically even if activation hook didn't fire.
 */
function rvghs_chatbot_ensure_tables_exist() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    $table_interactions = $wpdb->prefix . 'rvghs_interactions';
    $table_leads = $wpdb->prefix . 'rvghs_leads';

    if ($wpdb->get_var("SHOW TABLES LIKE '$table_interactions'") !== $table_interactions) {
        $sql_interactions = "CREATE TABLE $table_interactions (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            session_id varchar(100) NOT NULL,
            event_type varchar(100) NOT NULL,
            interaction_id varchar(255) DEFAULT '',
            query_text text,
            meta_data longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY session_id (session_id),
            KEY event_type (event_type)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_interactions);
    }

    if ($wpdb->get_var("SHOW TABLES LIKE '$table_leads'") !== $table_leads) {
        $sql_leads = "CREATE TABLE $table_leads (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            session_id varchar(100) NOT NULL,
            lead_data longtext,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            KEY session_id (session_id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql_leads);
    }
}

/**
 * =========================================================================
 * 2. WORDPRESS ADMIN MENU & DASHBOARD ROUTING
 * =========================================================================
 */
function rvghs_chatbot_add_admin_menu() {
    add_menu_page(
        __('RVGHS Chatbot Settings', 'rvghs-chatbot'),
        __('RVGHS Chatbot', 'rvghs-chatbot'),
        'manage_options',
        'rvghs-chatbot',
        'rvghs_chatbot_settings_page',
        'dashicons-format-chat',
        100
    );

    add_submenu_page(
        'rvghs-chatbot',
        __('Analytics Dashboard', 'rvghs-chatbot'),
        __('Analytics Dashboard', 'rvghs-chatbot'),
        'manage_options',
        'rvghs-chatbot-dashboard',
        'rvghs_chatbot_analytics_dashboard_page'
    );
}
add_action('admin_menu', 'rvghs_chatbot_add_admin_menu');

/**
 * Render the Analytics Dashboard Page
 */
function rvghs_chatbot_analytics_dashboard_page() {
    $dashboard_url = admin_url('admin-post.php?action=rvghs_chatbot_dashboard_view&tab=index');
    ?>
    <div class="wrap" style="margin: 0; padding: 0; max-width: 100%; height: calc(100vh - 40px);">
        <iframe src="<?php echo esc_url($dashboard_url); ?>" style="width: 100%; height: 100%; border: none; min-height: 800px; border-radius: 8px;"></iframe>
    </div>
    <?php
}

/**
 * Handle Secure Admin-Post Routing for Dashboard Tabs
 */
function rvghs_chatbot_render_dashboard_tab() {
    if (!current_user_can('manage_options')) {
        wp_die('Unauthorized');
    }

    $tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'index';
    $allowed_tabs = array('index', 'interactions', 'sessions', 'leads', 'analytics');

    if (!in_array($tab, $allowed_tabs)) {
        wp_die('Invalid dashboard tab requested.');
    }

    $file_path = RVGHS_CHATBOT_DIR_PATH . 'dashboard/' . $tab . '.html';
    $file_path_php = RVGHS_CHATBOT_DIR_PATH . 'dashboard/' . $tab . '.php';

    if (file_exists($file_path_php)) {
        include $file_path_php;
    } elseif (file_exists($file_path)) {
        readfile($file_path);
    } else {
        // Fallback Native Overview
        rvghs_chatbot_render_native_dashboard_fallback();
    }
    exit;
}
add_action('admin_post_rvghs_chatbot_dashboard_view', 'rvghs_chatbot_render_dashboard_tab');

/**
 * Native Dashboard Fallback
 */
function rvghs_chatbot_render_native_dashboard_fallback() {
    global $wpdb;
    $table_interactions = $wpdb->prefix . 'rvghs_interactions';
    $table_leads = $wpdb->prefix . 'rvghs_leads';

    $total_interactions = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_interactions");
    $total_leads = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_leads");
    $recent_interactions = $wpdb->get_results("SELECT * FROM $table_interactions ORDER BY created_at DESC LIMIT 20", ARRAY_A);
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>RVGHS Analytics</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #030712; color: #f8fafc; margin: 0; padding: 24px; }
            .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
            .card { background: #111827; padding: 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); }
            .card h3 { margin: 0 0 10px; font-size: 14px; color: #94a3b8; }
            .card .number { font-size: 32px; font-weight: 700; color: #800080; }
            table { width: 100%; border-collapse: collapse; background: #111827; border-radius: 8px; overflow: hidden; }
            th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
            th { background: #1e293b; color: #cbd5e1; font-weight: 600; }
        </style>
    </head>
    <body>
        <h2>RV Girls High School — Chatbot Analytics</h2>
        <div class="card-grid">
            <div class="card">
                <h3>Total Interactions</h3>
                <div class="number"><?php echo $total_interactions; ?></div>
            </div>
            <div class="card">
                <h3>Captured Leads</h3>
                <div class="number"><?php echo $total_leads; ?></div>
            </div>
        </div>
        <h3>Recent Interactions</h3>
        <table>
            <thead>
                <tr>
                    <th>Session ID</th>
                    <th>Event</th>
                    <th>Query / Action</th>
                    <th>Timestamp</th>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($recent_interactions)): ?>
                    <?php foreach ($recent_interactions as $row): ?>
                        <tr>
                            <td><code><?php echo esc_html(substr($row['session_id'], 0, 16)); ?>...</code></td>
                            <td><span style="background: rgba(128,0,128,0.2); color: #d8b4fe; padding: 3px 8px; border-radius: 4px;"><?php echo esc_html($row['event_type']); ?></span></td>
                            <td><?php echo esc_html($row['query_text']); ?></td>
                            <td><?php echo esc_html($row['created_at']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr><td colspan="4">No interactions logged yet.</td></tr>
                <?php endif; ?>
            </tbody>
        </table>
    </body>
    </html>
    <?php
}

/**
 * =========================================================================
 * REST API ENDPOINTS FOR TELEMETRY & DASHBOARD
 * =========================================================================
 */
add_action('rest_api_init', 'rvghs_chatbot_register_rest_routes');

function rvghs_chatbot_register_rest_routes() {
    // 1. POST /wp-json/rvghs/v1/logs (Receives batched telemetry from frontend)
    register_rest_route('rvghs/v1', '/logs', array(
        'methods'             => array('POST', 'OPTIONS'),
        'callback'            => 'rvghs_chatbot_rest_save_logs',
        'permission_callback' => '__return_true',
    ));

    // 2. GET /wp-json/rvghs/v1/interactions (Returns interaction logs to dashboard)
    register_rest_route('rvghs/v1', '/interactions', array(
        'methods'             => array('GET', 'OPTIONS'),
        'callback'            => 'rvghs_chatbot_rest_get_interactions',
        'permission_callback' => '__return_true',
    ));

    // 3. GET /wp-json/rvghs/v1/logs (Alias for interactions)
    register_rest_route('rvghs/v1', '/logs', array(
        'methods'             => 'GET',
        'callback'            => 'rvghs_chatbot_rest_get_interactions',
        'permission_callback' => '__return_true',
    ));

    // 4. POST /wp-json/rvghs/v1/leads (Receives leads)
    register_rest_route('rvghs/v1', '/leads', array(
        'methods'             => array('POST', 'OPTIONS'),
        'callback'            => 'rvghs_chatbot_rest_save_lead',
        'permission_callback' => '__return_true',
    ));

    // 5. GET /wp-json/rvghs/v1/leads (Returns leads to dashboard)
    register_rest_route('rvghs/v1', '/leads', array(
        'methods'             => 'GET',
        'callback'            => 'rvghs_chatbot_rest_get_leads',
        'permission_callback' => '__return_true',
    ));

    // 6. GET /wp-json/rvghs/v1/stats (Aggregated metrics)
    register_rest_route('rvghs/v1', '/stats', array(
        'methods'             => 'GET',
        'callback'            => 'rvghs_chatbot_rest_get_stats',
        'permission_callback' => '__return_true',
    ));
}

// Enable CORS for all RVGHS REST API calls
add_filter('rest_pre_serve_request', function($value) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    return $value;
});

/**
 * REST Handler: Save Batched Logs
 */
function rvghs_chatbot_rest_save_logs(WP_REST_Request $request) {
    global $wpdb;
    rvghs_chatbot_ensure_tables_exist();

    $params = $request->get_json_params();
    if (empty($params)) {
        $params = json_decode($request->get_body(), true);
    }

    if (empty($params) || !is_array($params)) {
        return new WP_REST_Response(array('success' => false, 'message' => 'Invalid JSON body'), 400);
    }

    $session_id = isset($params['sessionId']) ? sanitize_text_field($params['sessionId']) : 'sid_anon';
    $events = isset($params['events']) && is_array($params['events']) ? $params['events'] : array();
    $table_interactions = $wpdb->prefix . 'rvghs_interactions';
    $saved_count = 0;

    foreach ($events as $event) {
        $event_type = isset($event['eventType']) ? sanitize_text_field($event['eventType']) : 'message';
        $data = isset($event['data']) && is_array($event['data']) ? $event['data'] : array();

        $interaction_id = isset($data['elementId']) ? sanitize_text_field($data['elementId']) : 
                          (isset($data['intent']) ? sanitize_text_field($data['intent']) : 
                          (isset($event['intent']) ? sanitize_text_field($event['intent']) : ''));

        $query_text = isset($data['elementText']) ? sanitize_text_field($data['elementText']) : 
                      (isset($data['query']) ? sanitize_text_field($data['query']) : 
                      (isset($event['query']) ? sanitize_text_field($event['query']) : ''));

        $meta_data_json = wp_json_encode($data);

        $inserted = $wpdb->insert(
            $table_interactions,
            array(
                'session_id'     => $session_id,
                'event_type'     => $event_type,
                'interaction_id' => $interaction_id,
                'query_text'     => $query_text,
                'meta_data'      => $meta_data_json,
                'created_at'     => current_time('mysql', 1)
            ),
            array('%s', '%s', '%s', '%s', '%s', '%s')
        );

        if ($inserted) {
            $saved_count++;
        }
    }

    // Forward to Vercel MongoDB backend if configured
    $vercel_url = get_option('rvghs_chatbot_vercel_url', '');
    if (!empty($vercel_url)) {
        $vercel_endpoint = rtrim($vercel_url, '/') . '/api/logs';
        wp_remote_post($vercel_endpoint, array(
            'headers'     => array('Content-Type' => 'application/json'),
            'body'        => wp_json_encode($params),
            'timeout'     => 3,
            'blocking'    => false
        ));
    }

    return new WP_REST_Response(array(
        'success' => true,
        'saved'   => $saved_count,
        'total'   => count($events)
    ), 200);
}

/**
 * REST Handler: Get Interactions
 */
function rvghs_chatbot_rest_get_interactions(WP_REST_Request $request) {
    global $wpdb;
    rvghs_chatbot_ensure_tables_exist();

    $table_interactions = $wpdb->prefix . 'rvghs_interactions';
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 500;
    if ($limit <= 0 || $limit > 1000) $limit = 500;

    $rows = $wpdb->get_results(
        $wpdb->prepare("SELECT * FROM $table_interactions ORDER BY created_at DESC LIMIT %d", $limit),
        ARRAY_A
    );

    $logs = array();
    if (!empty($rows)) {
        foreach ($rows as $row) {
            $meta = !empty($row['meta_data']) ? json_decode($row['meta_data'], true) : new stdClass();
            $logs[] = array(
                'id'             => (int) $row['id'],
                '_id'            => (string) $row['id'],
                'session_id'     => $row['session_id'],
                'sessionId'      => $row['session_id'],
                's'              => $row['session_id'],
                'event_type'     => $row['event_type'],
                'eventType'      => $row['event_type'],
                't'              => $row['event_type'],
                'interaction_id' => $row['interaction_id'],
                'i'              => $row['interaction_id'],
                'query_text'     => $row['query_text'],
                'q'              => $row['query_text'],
                'meta_data'      => $meta,
                'm'              => $meta,
                'created_at'     => $row['created_at'],
                'timestamp'      => $row['created_at'],
                'd'              => $row['created_at'],
            );
        }
    }

    return new WP_REST_Response($logs, 200);
}

/**
 * REST Handler: Save Lead
 */
function rvghs_chatbot_rest_save_lead(WP_REST_Request $request) {
    global $wpdb;
    rvghs_chatbot_ensure_tables_exist();

    $params = $request->get_json_params();
    if (empty($params)) {
        $params = json_decode($request->get_body(), true);
    }

    $session_id = isset($params['sessionId']) ? sanitize_text_field($params['sessionId']) : 'sid_anon';
    $lead_data = isset($params['leadData']) ? $params['leadData'] : $params;

    $table_leads = $wpdb->prefix . 'rvghs_leads';
    $wpdb->insert(
        $table_leads,
        array(
            'session_id' => $session_id,
            'lead_data'  => wp_json_encode($lead_data),
            'created_at' => current_time('mysql', 1)
        ),
        array('%s', '%s', '%s')
    );

    return new WP_REST_Response(array('success' => true), 200);
}

/**
 * REST Handler: Get Leads
 */
function rvghs_chatbot_rest_get_leads(WP_REST_Request $request) {
    global $wpdb;
    rvghs_chatbot_ensure_tables_exist();

    $table_leads = $wpdb->prefix . 'rvghs_leads';
    $rows = $wpdb->get_results("SELECT * FROM $table_leads ORDER BY created_at DESC LIMIT 200", ARRAY_A);

    $leads = array();
    if (!empty($rows)) {
        foreach ($rows as $row) {
            $leads[] = array(
                'id'         => (int) $row['id'],
                'session_id' => $row['session_id'],
                'lead_data'  => json_decode($row['lead_data'], true),
                'created_at' => $row['created_at']
            );
        }
    }

    return new WP_REST_Response($leads, 200);
}

/**
 * REST Handler: Get Stats
 */
function rvghs_chatbot_rest_get_stats(WP_REST_Request $request) {
    global $wpdb;
    rvghs_chatbot_ensure_tables_exist();

    $table_interactions = $wpdb->prefix . 'rvghs_interactions';
    $table_leads = $wpdb->prefix . 'rvghs_leads';

    $total_interactions = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_interactions");
    $total_sessions = (int) $wpdb->get_var("SELECT COUNT(DISTINCT session_id) FROM $table_interactions");
    $total_leads = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_leads");

    return new WP_REST_Response(array(
        'total_interactions' => $total_interactions,
        'total_sessions'     => $total_sessions,
        'total_leads'        => $total_leads
    ), 200);
}

/**
 * =========================================================================
 * 3. ADMIN SETTINGS REGISTRATION & RENDERING
 * =========================================================================
 */
function rvghs_chatbot_register_settings() {
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_enabled', array('sanitize_callback' => 'sanitize_text_field'));
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_title', array('sanitize_callback' => 'sanitize_text_field'));
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_status_text', array('sanitize_callback' => 'sanitize_text_field'));
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_welcome_text', array('sanitize_callback' => 'sanitize_textarea_field'));
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_vercel_url', array('sanitize_callback' => 'esc_url_raw'));
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_sheets_url', array('sanitize_callback' => 'esc_url_raw'));
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_logo_url', array('sanitize_callback' => 'esc_url_raw'));
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_receiver_email', array('sanitize_callback' => 'sanitize_email'));
    register_setting('rvghs_chatbot_options_group', 'rvghs_chatbot_sender_email', array('sanitize_callback' => 'sanitize_email'));
}
add_action('admin_init', 'rvghs_chatbot_register_settings');

/**
 * Settings Page HTML
 */
function rvghs_chatbot_settings_page() {
    $default_logo = RVGHS_CHATBOT_DIR_URL . 'assets/Logo.png';
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(__('RV Girls High School (RVGHS) Chatbot Settings', 'rvghs-chatbot')); ?></h1>
        <p><?php echo esc_html(__('Manage and customize your RVGHS Chatbot appearance, behaviors, and dual-write telemetry integrations.', 'rvghs-chatbot')); ?></p>

        <hr />

        <form method="post" action="options.php"
            style="max-width: 820px; background: #ffffff; padding: 25px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-top: 20px;">
            <?php settings_fields('rvghs_chatbot_options_group'); ?>
            <?php do_settings_sections('rvghs_chatbot_options_group'); ?>

            <table class="form-table" style="width: 100%;">

                <!-- Enabled / Disabled Option -->
                <tr valign="top">
                    <th scope="row" style="width: 220px; font-weight: 600;">
                        <?php _e('Enable Chatbot', 'rvghs-chatbot'); ?>
                    </th>
                    <td>
                        <label>
                            <input type="checkbox" name="rvghs_chatbot_enabled" value="1" <?php checked('1', get_option('rvghs_chatbot_enabled', '1')); ?> />
                            <span><?php _e('Display the interactive chatbot widget on website frontend.', 'rvghs-chatbot'); ?></span>
                        </label>
                    </td>
                </tr>

                <!-- Chatbot Header Title -->
                <tr valign="top">
                    <th scope="row" style="font-weight: 600;"><?php _e('Header Title', 'rvghs-chatbot'); ?></th>
                    <td>
                        <input type="text" name="rvghs_chatbot_title"
                            value="<?php echo esc_attr(get_option('rvghs_chatbot_title', 'RV Girls High School')); ?>"
                            class="regular-text" style="width: 100%; max-width: 450px;" required />
                        <p class="description"><?php _e('Header title shown at the top of the chat widget.', 'rvghs-chatbot'); ?></p>
                    </td>
                </tr>

                <!-- Chatbot Status Text -->
                <tr valign="top">
                    <th scope="row" style="font-weight: 600;"><?php _e('Status Message', 'rvghs-chatbot'); ?></th>
                    <td>
                        <input type="text" name="rvghs_chatbot_status_text"
                            value="<?php echo esc_attr(get_option('rvghs_chatbot_status_text', 'Online - Ready to help')); ?>"
                            class="regular-text" style="width: 100%; max-width: 450px;" required />
                        <p class="description"><?php _e('Sub-heading status text under the title.', 'rvghs-chatbot'); ?></p>
                    </td>
                </tr>

                <!-- Welcome Teaser Text -->
                <tr valign="top">
                    <th scope="row" style="font-weight: 600;"><?php _e('Welcome Teaser Text', 'rvghs-chatbot'); ?></th>
                    <td>
                        <textarea name="rvghs_chatbot_welcome_text" rows="3" class="large-text"
                            style="width: 100%; max-width: 450px;"
                            required><?php echo esc_textarea(get_option('rvghs_chatbot_welcome_text', 'Welcome to RV Girls High School! Need help with admissions or school info? Chat with us!')); ?></textarea>
                        <p class="description"><?php _e('Teaser tooltip text displayed above launcher button.', 'rvghs-chatbot'); ?></p>
                    </td>
                </tr>

                <!-- Vercel Backend URL (MongoDB / External Dashboard) -->
                <tr valign="top">
                    <th scope="row" style="font-weight: 600;"><?php _e('Vercel Backend URL', 'rvghs-chatbot'); ?></th>
                    <td>
                        <input type="url" name="rvghs_chatbot_vercel_url"
                            value="<?php echo esc_url(get_option('rvghs_chatbot_vercel_url', '')); ?>"
                            class="regular-text" style="width: 100%; max-width: 450px;"
                            placeholder="https://your-vercel-app.vercel.app" />
                        <p class="description"><?php _e('Vercel Node.js backend URL (without /api) to dual-write telemetry to MongoDB & external dashboard.', 'rvghs-chatbot'); ?></p>
                    </td>
                </tr>

                <!-- Google Sheets API URL -->
                <tr valign="top">
                    <th scope="row" style="font-weight: 600;"><?php _e('Google Sheets Endpoint URL', 'rvghs-chatbot'); ?></th>
                    <td>
                        <input type="url" name="rvghs_chatbot_sheets_url"
                            value="<?php echo esc_url(get_option('rvghs_chatbot_sheets_url', '')); ?>"
                            class="regular-text" style="width: 100%; max-width: 450px;"
                            placeholder="https://script.google.com/macros/s/.../exec" />
                        <p class="description"><?php _e('Optional Google Apps Script webhook to record form leads.', 'rvghs-chatbot'); ?></p>
                    </td>
                </tr>

                <!-- Custom Logo URL -->
                <tr valign="top">
                    <th scope="row" style="font-weight: 600;"><?php _e('Logo Image URL', 'rvghs-chatbot'); ?></th>
                    <td>
                        <input type="url" name="rvghs_chatbot_logo_url"
                            value="<?php echo esc_url(get_option('rvghs_chatbot_logo_url', $default_logo)); ?>"
                            class="regular-text" style="width: 100%; max-width: 450px;" />
                        <p class="description"><?php _e('URL of the school logo in the chat header. Defaults to bundled RVGHS logo.', 'rvghs-chatbot'); ?></p>
                    </td>
                </tr>

                <!-- Receiver Email -->
                <tr valign="top">
                    <th scope="row" style="font-weight: 600;"><?php _e('Lead Receiver Email', 'rvghs-chatbot'); ?></th>
                    <td>
                        <input type="email" name="rvghs_chatbot_receiver_email"
                            value="<?php echo esc_attr(get_option('rvghs_chatbot_receiver_email', 'rvghs@rvei.edu.in')); ?>"
                            class="regular-text" style="width: 100%; max-width: 450px;" />
                        <p class="description"><?php _e('Email address where chatbot lead notifications are sent.', 'rvghs-chatbot'); ?></p>
                    </td>
                </tr>

                <!-- Sender Email -->
                <tr valign="top">
                    <th scope="row" style="font-weight: 600;"><?php _e('Sender Email (From)', 'rvghs-chatbot'); ?></th>
                    <td>
                        <input type="email" name="rvghs_chatbot_sender_email"
                            value="<?php echo esc_attr(get_option('rvghs_chatbot_sender_email', 'noreply.rvghs@rvei.edu.in')); ?>"
                            class="regular-text" style="width: 100%; max-width: 450px;" />
                        <p class="description"><?php _e('Email address used in the From header for alerts.', 'rvghs-chatbot'); ?></p>
                    </td>
                </tr>

            </table>

            <?php submit_button(__('Save Chatbot Settings', 'rvghs-chatbot'), 'primary', 'submit', true, array('style' => 'margin-top: 20px;')); ?>
        </form>
    </div>
    <?php
}

/**
 * =========================================================================
 * 4. REST API ENDPOINTS (DUAL WRITE & DASHBOARD DATA)
 * =========================================================================
 */
add_action('rest_api_init', 'rvghs_chatbot_register_rest_routes');

function rvghs_chatbot_register_rest_routes() {
    // Standard namespace
    register_rest_route('rvghs/v1', '/logs', array(
        'methods' => 'POST',
        'callback' => 'rvghs_chatbot_rest_log_batch',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('rvghs/v1', '/interactions', array(
        'methods' => 'GET',
        'callback' => 'rvghs_chatbot_get_interactions',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('rvghs/v1', '/leads', array(
        'methods' => 'GET',
        'callback' => 'rvghs_chatbot_get_leads',
        'permission_callback' => '__return_true'
    ));

    register_rest_route('rvghs/v1', '/stats', array(
        'methods' => 'GET',
        'callback' => 'rvghs_chatbot_get_stats',
        'permission_callback' => '__return_true'
    ));

    // Backward compatibility aliases
    register_rest_route('rvghs-chatbot/v1', '/log', array(
        'methods' => 'POST',
        'callback' => 'rvghs_chatbot_rest_log_batch',
        'permission_callback' => '__return_true'
    ));
}

/**
 * Batch Event Handler with Auto Lead Extraction
 */
function rvghs_chatbot_rest_log_batch(WP_REST_Request $request) {
    rvghs_chatbot_ensure_tables_exist();
    global $wpdb;

    $params = $request->get_json_params();
    if (empty($params)) {
        $params = $request->get_params();
    }

    $session_id = isset($params['sessionId']) ? sanitize_text_field($params['sessionId']) : (isset($params['s']) ? sanitize_text_field($params['s']) : '');
    
    // Normalize events array
    $events = array();
    if (isset($params['events']) && is_array($params['events'])) {
        $events = $params['events'];
    } elseif (isset($params['eventType'])) {
        $events[] = $params;
    } elseif (isset($params['q']) || isset($params['i'])) {
        $events[] = array(
            'eventType' => isset($params['t']) ? $params['t'] : 'message',
            'data' => array(
                'query' => isset($params['q']) ? $params['q'] : '',
                'intent' => isset($params['i']) ? $params['i'] : 'user_input'
            )
        );
    }

    if (empty($session_id) || empty($events)) {
        return new WP_Error('invalid_data', 'No valid events or session ID provided', array('status' => 400));
    }

    $table_interactions = $wpdb->prefix . 'rvghs_interactions';
    $table_leads = $wpdb->prefix . 'rvghs_leads';

    foreach ($events as $e) {
        $event_type = isset($e['eventType']) ? sanitize_text_field($e['eventType']) : 'unknown';
        $data = isset($e['data']) ? $e['data'] : array();

        // 1. Auto-detect Leads from form submission OR text containing email/phone
        $is_lead = ($event_type === 'form_submit');
        $extracted_email = '';
        $extracted_phone = '';

        $text_to_scan = wp_json_encode($data);
        if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $text_to_scan, $matches)) {
            $extracted_email = $matches[0];
            $is_lead = true;
        }
        if (preg_match('/(?:\+91|0)?[6-9]\d{9}/', $text_to_scan, $matches)) {
            $extracted_phone = $matches[0];
            $is_lead = true;
        }

        if ($is_lead) {
            $lead_payload = isset($data['leadData']) ? $data['leadData'] : $data;
            if (!isset($lead_payload['email']) && $extracted_email) $lead_payload['email'] = $extracted_email;
            if (!isset($lead_payload['phone']) && $extracted_phone) $lead_payload['phone'] = $extracted_phone;
            if (!isset($lead_payload['name'])) {
                if (preg_match('/(?:Name|Full Name)[\:\s]+([a-zA-Z\s]+)(?:Phone|Email|$)/i', $text_to_scan, $n_matches)) {
                    $lead_payload['name'] = trim($n_matches[1]);
                } else {
                    $lead_payload['name'] = 'Chat Visitor';
                }
            }
            if (!isset($lead_payload['formType'])) $lead_payload['formType'] = 'Chat Lead';

            $wpdb->insert($table_leads, array(
                'session_id' => $session_id,
                'lead_data'  => wp_json_encode($lead_payload),
                'created_at' => current_time('mysql', 1)
            ));
        }

        // 2. Log Interaction
        $interactionId = $event_type;
        if ($event_type === 'message') {
            $interactionId = isset($data['intent']) ? sanitize_text_field($data['intent']) : 'user_message';
        } elseif (in_array($event_type, array('click', 'hover', 'copy', 'dwell', 'scroll'))) {
            $elementId = isset($data['elementId']) ? sanitize_text_field($data['elementId']) : '';
            $interactionId = $event_type . ($elementId ? (':' . $elementId) : '');
        }

        $queryText = isset($data['elementText']) ? sanitize_text_field($data['elementText']) : (isset($data['query']) ? sanitize_text_field($data['query']) : '');
        if (!$queryText) {
            if ($event_type === 'heartbeat') {
                $queryText = 'User active on page (Dwell: ' . (isset($data['dwellTimeSeconds']) ? intval($data['dwellTimeSeconds']) : 0) . 's)';
            } elseif ($event_type === 'page_load') {
                $queryText = 'Opened Chatbot Widget';
            } elseif ($event_type === 'scroll') {
                $queryText = 'Scrolled down page';
            } elseif ($event_type === 'copy') {
                $queryText = 'Copied text to clipboard';
            } else {
                $queryText = $event_type;
            }
        }

        $wpdb->insert($table_interactions, array(
            'session_id'     => $session_id,
            'event_type'     => $event_type,
            'interaction_id' => $interactionId,
            'query_text'     => $queryText,
            'meta_data'      => wp_json_encode($data),
            'created_at'     => current_time('mysql', 1)
        ));
    }

    return rest_ensure_response(array('success' => true, 'message' => 'Telemetry saved successfully'));
}

/**
 * Interactions endpoint (normalized for Command Center)
 */
function rvghs_chatbot_get_interactions(WP_REST_Request $request) {
    rvghs_chatbot_ensure_tables_exist();
    global $wpdb;
    $table_name = $wpdb->prefix . 'rvghs_interactions';

    $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC LIMIT 5000", ARRAY_A);
    $formatted = array();
    foreach ($results as $row) {
        $formatted[] = array(
            's' => $row['session_id'],
            'd' => $row['created_at'],
            't' => ($row['event_type'] === 'message') ? 'message' : (($row['event_type'] === 'page_load') ? 'session' : 'interaction'),
            'i' => $row['interaction_id'],
            'q' => $row['query_text'],
            'm' => json_decode($row['meta_data'], true)
        );
    }
    return rest_ensure_response($formatted);
}

/**
 * Leads endpoint (normalized for Command Center)
 */
function rvghs_chatbot_get_leads(WP_REST_Request $request) {
    rvghs_chatbot_ensure_tables_exist();
    global $wpdb;
    $table_name = $wpdb->prefix . 'rvghs_leads';

    $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC LIMIT 500", ARRAY_A);
    $formatted = array();
    foreach ($results as $row) {
        $formatted[] = array(
            'sessionId' => $row['session_id'],
            'timestamp' => $row['created_at'],
            'data'      => json_decode($row['lead_data'], true)
        );
    }
    return rest_ensure_response($formatted);
}

/**
 * Summary Stats Endpoint
 */
function rvghs_chatbot_get_stats(WP_REST_Request $request) {
    rvghs_chatbot_ensure_tables_exist();
    global $wpdb;
    $table_interactions = $wpdb->prefix . 'rvghs_interactions';
    $table_leads = $wpdb->prefix . 'rvghs_leads';

    $total_interactions = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_interactions");
    $total_leads = (int) $wpdb->get_var("SELECT COUNT(*) FROM $table_leads");
    $active_sessions = (int) $wpdb->get_var("SELECT COUNT(DISTINCT session_id) FROM $table_interactions WHERE created_at > DATE_SUB(NOW(), INTERVAL 30 MINUTE)");

    return rest_ensure_response(array(
        'totalInteractions' => $total_interactions,
        'totalLeads'        => $total_leads,
        'activeSessions'    => $active_sessions
    ));
}

/**
 * =========================================================================
 * 5. ENQUEUE ASSETS & SCRIPT LOCALIZATION
 * =========================================================================
 */
function rvghs_chatbot_enqueue_assets() {
    // Only load if chatbot is enabled
    if (get_option('rvghs_chatbot_enabled', '1') !== '1') {
        return;
    }

    $default_logo = RVGHS_CHATBOT_DIR_URL . 'assets/Logo.png';
    $logo_url = trim(get_option('rvghs_chatbot_logo_url', '')) ? trim(get_option('rvghs_chatbot_logo_url', '')) : $default_logo;
    $title = get_option('rvghs_chatbot_title', 'RV Girls High School');
    $status_text = get_option('rvghs_chatbot_status_text', 'Online - Ready to help');
    $welcome_text = get_option('rvghs_chatbot_welcome_text', 'Welcome to RV Girls High School! Need help with admissions or school info? Chat with us!');

    // Phosphor Icons
    wp_enqueue_script(
        'phosphor-icons',
        'https://unpkg.com/@phosphor-icons/web',
        array(),
        null,
        false
    );

    // Google Fonts (Inter)
    wp_enqueue_style(
        'rvghs-chatbot-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        array(),
        null
    );

    // Main Stylesheet
    wp_enqueue_style(
        'rvghs-chatbot-style',
        RVGHS_CHATBOT_DIR_URL . 'assets/index.css',
        array('rvghs-chatbot-fonts'),
        RVGHS_CHATBOT_VERSION
    );

    // Telemetry Engine
    wp_enqueue_script(
        'rvghs-chatbot-telemetry',
        RVGHS_CHATBOT_DIR_URL . 'assets/telemetry.js',
        array(),
        RVGHS_CHATBOT_VERSION,
        true
    );

    // Core Chatbot Application Script
    wp_enqueue_script(
        'rvghs-chatbot-script',
        RVGHS_CHATBOT_DIR_URL . 'assets/app.js',
        array('rvghs-chatbot-telemetry'),
        RVGHS_CHATBOT_VERSION,
        true
    );

    // Localize script to pass WordPress admin values to frontend Javascript
    wp_localize_script(
        'rvghs-chatbot-script',
        'rvghsChatbotSettings',
        array(
            'pluginUrl'       => RVGHS_CHATBOT_DIR_URL,
            'assetsUrl'       => RVGHS_CHATBOT_DIR_URL . 'assets/',
            'logoUrl'         => esc_url($logo_url),
            'mascotUrl'       => RVGHS_CHATBOT_DIR_URL . 'assets/mascot_v2.png',
            'mascotThinking'  => RVGHS_CHATBOT_DIR_URL . 'assets/mascot_thinking_v2.png',
            'mascotSuccess'   => RVGHS_CHATBOT_DIR_URL . 'assets/mascot_success_v2.png',
            'title'           => esc_html($title),
            'statusText'      => esc_html($status_text),
            'welcomeText'     => esc_html($welcome_text),
            'sheetsUrl'       => esc_url_raw(get_option('rvghs_chatbot_sheets_url', '')),
            'restUrl'         => esc_url_raw(rest_url('rvghs/v1')),
            'vercelUrl'       => esc_url_raw(get_option('rvghs_chatbot_vercel_url', '')),
            'ajaxUrl'         => admin_url('admin-ajax.php'),
            'nonce'           => wp_create_nonce('rvghs_chatbot_nonce')
        )
    );
}
add_action('wp_enqueue_scripts', 'rvghs_chatbot_enqueue_assets');

/**
 * =========================================================================
 * 6. INJECT CHATBOT HTML MARKUP INTO FOOTER
 * =========================================================================
 */
function rvghs_chatbot_render_footer_html() {
    if (get_option('rvghs_chatbot_enabled', '1') !== '1') {
        return;
    }

    $default_logo = RVGHS_CHATBOT_DIR_URL . 'assets/Logo.png';
    $logo_url = trim(get_option('rvghs_chatbot_logo_url', '')) ? trim(get_option('rvghs_chatbot_logo_url', '')) : $default_logo;
    $title = get_option('rvghs_chatbot_title', 'RV Girls High School');
    $status_text = get_option('rvghs_chatbot_status_text', 'Online - Ready to help');
    $mascot_url = RVGHS_CHATBOT_DIR_URL . 'assets/garuda_head.png';
    $hero_mascot_url = RVGHS_CHATBOT_DIR_URL . 'assets/mascot_v2.png';
    ?>
    <style id="rvghs-launcher-direct-styles">
        .chat-launcher::before {
            animation: rvs-bg-pop-circle 2.2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite !important;
        }
        @keyframes rvs-bg-pop-circle {
            0% { box-shadow: 0 0 0 0 rgba(128, 0, 128, 0.85), 0 0 0 0 rgba(128, 0, 128, 0.5), 0 4px 16px rgba(128, 0, 128, 0.4); }
            40% { box-shadow: 0 0 0 14px rgba(128, 0, 128, 0.4), 0 0 0 0 rgba(128, 0, 128, 0.5), 0 6px 22px rgba(128, 0, 128, 0.65); }
            70% { box-shadow: 0 0 0 28px rgba(128, 0, 128, 0), 0 0 0 14px rgba(128, 0, 128, 0.3), 0 8px 24px rgba(128, 0, 128, 0.5); }
            100% { box-shadow: 0 0 0 38px rgba(128, 0, 128, 0), 0 0 0 28px rgba(128, 0, 128, 0), 0 4px 16px rgba(128, 0, 128, 0.4); }
        }
    </style>
    <!-- RVGHS Floating Chat Launcher -->
    <button class="chat-launcher" id="chatLauncher" title="<?php esc_attr_e('Chat with us!', 'rvghs-chatbot'); ?>" aria-label="<?php esc_attr_e('Open Chat', 'rvghs-chatbot'); ?>" type="button">
        <img src="<?php echo esc_url($mascot_url); ?>" alt="Chat Mascot" class="launcher-mascot" id="launcherMascotImg">
    </button>

    <!-- RVGHS Chat Widget -->
    <div class="chat-widget" id="chatWidget" role="dialog" aria-label="<?php echo esc_attr($title); ?>">
        <!-- Header -->
        <div class="chat-header">
            <div class="header-info">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="<?php echo esc_url($logo_url); ?>" alt="<?php echo esc_attr($title); ?> Logo" class="header-logo" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; background: white; padding: 2px;">
                    <div>
                        <h2 id="chatSchoolName" style="margin: 0; font-size: 16px; font-weight: 600;"><?php echo esc_html($title); ?></h2>
                        <div class="status"><span class="dot"></span> <?php echo esc_html($status_text); ?></div>
                    </div>
                </div>
            </div>
            <div class="header-actions">
                <button id="clearChatBtn" title="<?php esc_attr_e('Clear chat', 'rvghs-chatbot'); ?>" aria-label="<?php esc_attr_e('Clear chat', 'rvghs-chatbot'); ?>" type="button" style="display: inline-flex; align-items: center; justify-content: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                </button>
                <button id="closeChatBtn" title="<?php esc_attr_e('Close chat', 'rvghs-chatbot'); ?>" aria-label="<?php esc_attr_e('Close chat', 'rvghs-chatbot'); ?>" type="button">✖</button>
            </div>
        </div>

        <!-- Chat Body -->
        <div class="chat-body" id="chatBody" style="position: relative;">
            <!-- Hero Screen -->
            <div id="rvghs-hero-screen" class="hero-screen">
                <img src="<?php echo esc_url($hero_mascot_url); ?>" alt="Mascot" class="hero-mascot">
                <div class="hero-sign"><?php echo esc_html(sprintf(__('Welcome to %s!', 'rvghs-chatbot'), $title)); ?></div>
            </div>
            <div class="chat-container" id="chatContainer"></div>
        </div>

        <!-- Input Area -->
        <div class="chat-input-area" style="position: relative;">
            <div class="quick-suggestions" id="quickSuggestions">
                <button class="suggestion-chip" data-query="menu" type="button">📋 Menu</button>
                <button class="suggestion-chip" data-query="admissions" type="button">📚 Admissions</button>
                <button class="suggestion-chip" data-query="academics" type="button">📖 Academics</button>
                <button class="suggestion-chip" data-query="contact" type="button">📞 Contact</button>
            </div>
            <div id="typeahead" class="typeahead-container hidden"></div>
            <div class="chat-input-wrapper">
                <button id="micBtn" class="mic-btn" title="<?php esc_attr_e('Voice Search', 'rvghs-chatbot'); ?>" aria-label="<?php esc_attr_e('Voice Search', 'rvghs-chatbot'); ?>" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
                </button>
                <input type="text" id="chatInput" placeholder="<?php esc_attr_e('Type a message…', 'rvghs-chatbot'); ?>" autocomplete="off" aria-label="<?php esc_attr_e('Type your question', 'rvghs-chatbot'); ?>" />
                <button class="send-btn" id="sendBtn" title="<?php esc_attr_e('Send', 'rvghs-chatbot'); ?>" aria-label="<?php esc_attr_e('Send message', 'rvghs-chatbot'); ?>" type="button">➤</button>
            </div>
        </div>
    </div>
    <?php
}
add_action('wp_footer', 'rvghs_chatbot_render_footer_html', 999);
