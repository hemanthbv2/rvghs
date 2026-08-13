<?php
/**
 * Plugin Name: RVGHS Chatbot Telemetry
 * Description: Dual-write telemetry receiver for the RVGHS Chatbot, storing logs in WordPress and forwarding to Vercel/MongoDB.
 * Version: 1.0.0
 * Author: Antigravity IDE
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Define plugin constants
define('RVGHS_CHATBOT_PLUGIN_DIR', plugin_dir_path(__FILE__));

// Include REST API endpoints
require_once RVGHS_CHATBOT_PLUGIN_DIR . 'api/rest-api.php';

// Include Admin Settings
require_once RVGHS_CHATBOT_PLUGIN_DIR . 'admin/settings-page.php';

// Create DB table on activation
register_activation_hook(__FILE__, 'rvghs_chatbot_create_db');
function rvghs_chatbot_create_db() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'rvghs_chatbot_logs';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        session_id varchar(255) NOT NULL,
        query text NOT NULL,
        intent varchar(255) NOT NULL,
        timestamp datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
        event_type varchar(50) DEFAULT 'message' NOT NULL,
        metadata text DEFAULT NULL,
        device varchar(255) DEFAULT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
