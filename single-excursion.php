<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 *
 * @subpackage  Timber
 *
 * @since    Timber 0.1
 */

global $wpdb;
$context         = Timber::get_context();
$post            = Timber::query_post();
$context['post'] = $post;
$tableName       = $wpdb->prefix."rkg_excursion_meta";
$context['meta'] = $wpdb->get_row(
    "SELECT id, latitude, longitude, canceled"
    .", price, limitation, registered, starttime, endtime, deadline FROM "
    .$tableName
    ." WHERE id="
    .$post->ID
);


$join = $wpdb->prefix."posts";
$same = $wpdb->get_col(
    "SELECT m.id FROM "
    .$tableName
    ." AS m "
    ."INNER JOIN ".$join." AS p ON m.id = p.id "
    ." WHERE m.starttime="
    ."'".$context['meta']->starttime."'"
    ." AND p.post_status='publish'"
);

$currentKey = array_search($post->ID, $same);

if (isset($same[$currentKey-1])) {
    $context['prev'] = new Timber\Post($same[$currentKey-1]);
}

if (empty($context['prev'])) {
    $ex = $wpdb->get_var($wpdb->prepare(
            "SELECT m.id FROM ".
            $tableName
            ." AS m "
            ."INNER JOIN ".$join." AS p ON m.id = p.id "
            ." WHERE m.starttime < %s"
            ." AND p.post_status='publish'"
            ." ORDER BY m.starttime DESC LIMIT 1",
            $context['meta']->starttime
        )
    );
    if ($ex) {
        $context['prev'] = new Timber\Post($ex);
    }
}

if (isset($same[$currentKey+1])) {
    $context['next'] = new Timber\Post($same[$currentKey+1]);
}

if (empty($context['next'])) {
    $ex = $wpdb->get_var($wpdb->prepare(
            "SELECT m.id FROM ".
            $tableName
            ." AS m "
            ."INNER JOIN ".$join." AS p ON m.id = p.id "
            ." WHERE m.starttime > %s"
            ." AND p.post_status='publish'"
            ." ORDER BY m.starttime ASC LIMIT 1",
            $context['meta']->starttime
        )
    );
    if ($ex) {
        $context['next'] = new Timber\Post($ex);
    }
}

$tableName = $wpdb->prefix."rkg_excursion_signup";
$participants = $wpdb->get_col(
    "SELECT user_id FROM "
    .$tableName
    ." WHERE post_id="
    .$post->ID
    ." ORDER BY created"
);

foreach ($participants as $value) {
    $context['participants'][] = new Timber\User($value);
}

$tableName = $wpdb->prefix."rkg_excursion_waiting";
$replacements = $wpdb->get_col(
    "SELECT user_id FROM "
    .$tableName
    ." WHERE post_id="
    .$post->ID
    ." ORDER BY created"
);

$tableName = $wpdb->prefix."rkg_excursion_gear";
$context['gear'] = $wpdb->get_col(
    "SELECT user_id FROM "
    .$tableName
    ." WHERE post_id="
    .$post->ID
    ." AND user_id="
    .$context['user']->id
);

foreach ($replacements as $value) {
    $context['replacements'][] = new Timber\User($value);
}

$tableName = $wpdb->prefix."rkg_excursion_guest";
$context['guests'] = $wpdb->get_results(
    "SELECT name as display_name, email as user_email, tel FROM "
    .$tableName
    ." WHERE post_id="
    .$post->ID
    ." ORDER BY created"
);

$tableName = $wpdb->prefix."rkg_excursion_guest";
$context['myGuests'] = $wpdb->get_results(
    "SELECT name as display_name, email as user_email, tel FROM "
    .$tableName
    ." WHERE post_id="
    .$post->ID
    ." AND user_id="
    .$context['user']->id
    ." ORDER BY created"
);

if (post_password_required($post->ID)) {
    Timber::render('single-password.twig', $context);
} elseif (!current_user_can('edit_excursion')) {
    Timber::render('single-no-pasaran.twig', $context);
} else {
    Timber::render('single-excursion.twig', $context);
}
