<?php
if (!defined('ABSPATH')) exit;

add_action('rest_api_init', function () {
    register_rest_route('rvghs-chatbot/v1', '/log', array(
        'methods' => 'POST',
        'callback' => 'rvghs_chatbot_rest_log_interaction',
        'permission_callback' => '__return_true' // Open endpoint for telemetry
    ));
});

function rvghs_chatbot_rest_log_interaction(WP_REST_Request $request) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'rvghs_chatbot_logs';
    $params = $request->get_json_params();

    if (empty($params['s']) || empty($params['q']) || empty($params['i'])) {
        return new WP_Error('missing_params', 'Missing required parameters', array('status' => 400));
    }

    $session_id = sanitize_text_field($params['s']);
    $query      = sanitize_text_field($params['q']);
    $intent     = sanitize_text_field($params['i']);
    $timestamp  = !empty($params['d']) ? gmdate('Y-m-d H:i:s', strtotime($params['d'])) : current_time('mysql');
    $event_type = !empty($params['t']) ? sanitize_text_field($params['t']) : 'message';
    $metadata   = !empty($params['m']) ? wp_json_encode($params['m']) : null;
    $device     = !empty($params['device']) ? sanitize_text_field($params['device']) : null;

    // Save to local WordPress MySQL
    $inserted = $wpdb->insert(
        $table_name,
        array(
            'session_id' => $session_id,
            'query'      => $query,
            'intent'     => $intent,
            'timestamp'  => $timestamp,
            'event_type' => $event_type,
            'metadata'   => $metadata,
            'device'     => $device
        )
    );

    if ($inserted) {
        return rest_ensure_response(array('success' => true, 'id' => $wpdb->insert_id));
    }
    return new WP_Error('db_error', 'Failed to save log', array('status' => 500));
}
