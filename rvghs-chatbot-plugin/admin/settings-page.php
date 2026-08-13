<?php
if (!defined('ABSPATH')) exit;

add_action('admin_menu', 'rvghs_chatbot_add_admin_menu');
function rvghs_chatbot_add_admin_menu() {
    add_menu_page(
        'RVGHS Chatbot Settings',
        'RVGHS Chatbot',
        'manage_options',
        'rvghs_chatbot',
        'rvghs_chatbot_settings_page',
        'dashicons-format-chat',
        100
    );
}

add_action('admin_init', 'rvghs_chatbot_settings_init');
function rvghs_chatbot_settings_init() {
    register_setting('rvghs_chatbot_plugin', 'rvghs_chatbot_settings');

    add_settings_section(
        'rvghs_chatbot_plugin_section',
        __('API Configuration', 'rvghs-chatbot'),
        'rvghs_chatbot_settings_section_callback',
        'rvghs_chatbot_plugin'
    );

    add_settings_field(
        'rvghs_vercel_url',
        __('Vercel Dashboard URL (Node.js/MongoDB)', 'rvghs-chatbot'),
        'rvghs_vercel_url_render',
        'rvghs_chatbot_plugin',
        'rvghs_chatbot_plugin_section'
    );
}

function rvghs_vercel_url_render() {
    $options = get_option('rvghs_chatbot_settings');
    $val = isset($options['rvghs_vercel_url']) ? $options['rvghs_vercel_url'] : '';
    echo "<input type='url' name='rvghs_chatbot_settings[rvghs_vercel_url]' value='" . esc_attr($val) . "' style='width: 400px;' placeholder='https://your-vercel-app.vercel.app'>";
    echo "<p class='description'>Used by the frontend to dual-write telemetry. Do NOT include `/api` trailing slash.</p>";
}

function rvghs_chatbot_settings_section_callback() {
    echo __('Configure the connection between WordPress and the standalone Node.js dashboard.', 'rvghs-chatbot');
}

function rvghs_chatbot_settings_page() {
    ?>
    <div class="wrap">
        <h1>RVGHS Chatbot Settings</h1>
        <form action='options.php' method='post'>
            <?php
            settings_fields('rvghs_chatbot_plugin');
            do_settings_sections('rvghs_chatbot_plugin');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Provide an endpoint to fetch the vercel url from frontend if needed
// Though it's easier to just bake it into the JS or expose via wp_localize_script if enqueued properly.
// For now, we'll assume the frontend will be given the URL directly in app.js as requested.
