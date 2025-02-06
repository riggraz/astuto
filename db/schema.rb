# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2025_01_27_115010) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "api_keys", force: :cascade do |t|
    t.bigint "tenant_id", null: false
    t.bigint "user_id", null: false
    t.string "common_token_prefix", null: false
    t.string "random_token_prefix", null: false
    t.string "token_digest", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["tenant_id"], name: "index_api_keys_on_tenant_id"
    t.index ["token_digest"], name: "index_api_keys_on_token_digest", unique: true
    t.index ["user_id", "tenant_id"], name: "index_api_keys_on_user_id_and_tenant_id", unique: true
    t.index ["user_id"], name: "index_api_keys_on_user_id"
  end

  create_table "boards", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "order", null: false
    t.bigint "tenant_id", null: false
    t.string "slug"
    t.index ["name", "tenant_id"], name: "index_boards_on_name_and_tenant_id", unique: true
    t.index ["slug", "tenant_id"], name: "index_boards_on_slug_and_tenant_id", unique: true
    t.index ["tenant_id"], name: "index_boards_on_tenant_id"
  end

  create_table "comments", force: :cascade do |t|
    t.text "body"
    t.bigint "user_id", null: false
    t.bigint "post_id", null: false
    t.bigint "parent_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "is_post_update", default: false, null: false
    t.bigint "tenant_id", null: false
    t.index ["parent_id"], name: "index_comments_on_parent_id"
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["tenant_id"], name: "index_comments_on_tenant_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "follows", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "post_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "tenant_id", null: false
    t.index ["post_id"], name: "index_follows_on_post_id"
    t.index ["tenant_id"], name: "index_follows_on_tenant_id"
    t.index ["user_id", "post_id"], name: "index_follows_on_user_id_and_post_id", unique: true
    t.index ["user_id"], name: "index_follows_on_user_id"
  end

  create_table "invitations", force: :cascade do |t|
    t.string "email", null: false
    t.string "token_digest", null: false
    t.datetime "accepted_at"
    t.bigint "tenant_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email", "tenant_id"], name: "index_invitations_on_email_and_tenant_id", unique: true
    t.index ["tenant_id"], name: "index_invitations_on_tenant_id"
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "post_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "tenant_id", null: false
    t.index ["post_id"], name: "index_likes_on_post_id"
    t.index ["tenant_id"], name: "index_likes_on_tenant_id"
    t.index ["user_id", "post_id"], name: "index_likes_on_user_id_and_post_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
  end

  create_table "o_auths", force: :cascade do |t|
    t.string "name", null: false
    t.boolean "is_enabled", default: false, null: false
    t.string "client_id", null: false
    t.string "client_secret", null: false
    t.string "authorize_url", null: false
    t.string "token_url", null: false
    t.string "profile_url", null: false
    t.string "scope", null: false
    t.string "json_user_name_path"
    t.string "json_user_email_path", null: false
    t.bigint "tenant_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "slug"
    t.index ["name", "tenant_id"], name: "index_o_auths_on_name_and_tenant_id", unique: true
    t.index ["slug", "tenant_id"], name: "index_o_auths_on_slug_and_tenant_id", unique: true
    t.index ["tenant_id"], name: "index_o_auths_on_tenant_id"
  end

  create_table "post_status_changes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "post_id", null: false
    t.bigint "post_status_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "tenant_id", null: false
    t.index ["post_id"], name: "index_post_status_changes_on_post_id"
    t.index ["post_status_id"], name: "index_post_status_changes_on_post_status_id"
    t.index ["tenant_id"], name: "index_post_status_changes_on_tenant_id"
    t.index ["user_id"], name: "index_post_status_changes_on_user_id"
  end

  create_table "post_statuses", force: :cascade do |t|
    t.string "name", null: false
    t.string "color", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "order", null: false
    t.boolean "show_in_roadmap", default: false, null: false
    t.bigint "tenant_id", null: false
    t.index ["name", "tenant_id"], name: "index_post_statuses_on_name_and_tenant_id", unique: true
    t.index ["tenant_id"], name: "index_post_statuses_on_tenant_id"
  end

  create_table "posts", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.bigint "board_id", null: false
    t.bigint "user_id"
    t.bigint "post_status_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "tenant_id", null: false
    t.string "slug"
    t.integer "approval_status", default: 0, null: false
    t.index ["board_id"], name: "index_posts_on_board_id"
    t.index ["post_status_id"], name: "index_posts_on_post_status_id"
    t.index ["slug", "tenant_id"], name: "index_posts_on_slug_and_tenant_id", unique: true
    t.index ["tenant_id"], name: "index_posts_on_tenant_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "tenant_billings", force: :cascade do |t|
    t.bigint "tenant_id", null: false
    t.integer "status", default: 0, null: false
    t.datetime "trial_ends_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "customer_id"
    t.datetime "subscription_ends_at"
    t.string "slug"
    t.string "auth_token"
    t.index ["slug"], name: "index_tenant_billings_on_slug", unique: true
    t.index ["tenant_id"], name: "index_tenant_billings_on_tenant_id"
  end

  create_table "tenant_default_o_auths", force: :cascade do |t|
    t.bigint "tenant_id", null: false
    t.bigint "o_auth_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["o_auth_id"], name: "index_tenant_default_o_auths_on_o_auth_id"
    t.index ["tenant_id"], name: "index_tenant_default_o_auths_on_tenant_id"
  end

  create_table "tenant_settings", force: :cascade do |t|
    t.integer "brand_display", default: 0, null: false
    t.bigint "tenant_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "show_vote_count", default: true, null: false
    t.boolean "show_vote_button_in_board", default: true, null: false
    t.integer "root_board_id", default: 0, null: false
    t.boolean "show_roadmap_in_header", default: true, null: false
    t.integer "collapse_boards_in_header", default: 0, null: false
    t.text "custom_css"
    t.boolean "show_powered_by", default: true, null: false
    t.boolean "allow_anonymous_feedback", default: true, null: false
    t.integer "feedback_approval_policy", default: 0, null: false
    t.boolean "is_private", default: false, null: false
    t.integer "email_registration_policy", default: 0, null: false
    t.string "allowed_email_domains"
    t.boolean "use_browser_locale", default: false, null: false
    t.integer "logo_links_to", default: 0, null: false
    t.string "logo_custom_url"
    t.boolean "hide_unused_statuses_in_filter_by_status", default: false, null: false
    t.boolean "allow_attachment_upload", default: true
    t.index ["tenant_id"], name: "index_tenant_settings_on_tenant_id"
  end

  create_table "tenants", force: :cascade do |t|
    t.string "site_name", null: false
    t.string "old_site_logo"
    t.string "subdomain", null: false
    t.string "locale", default: "en"
    t.string "custom_domain"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "status"
    t.index ["custom_domain"], name: "index_tenants_on_custom_domain", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "role"
    t.string "full_name"
    t.boolean "notifications_enabled", default: true, null: false
    t.integer "status"
    t.bigint "tenant_id", null: false
    t.string "oauth_token"
    t.boolean "has_set_password", default: true, null: false
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.integer "recap_notification_frequency", default: 0, null: false
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email", "tenant_id"], name: "index_users_on_email_and_tenant_id", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["tenant_id"], name: "index_users_on_tenant_id"
  end

  create_table "webhooks", force: :cascade do |t|
    t.string "name", null: false
    t.string "description"
    t.boolean "is_enabled", default: false, null: false
    t.integer "trigger", default: 0, null: false
    t.string "url", null: false
    t.text "http_body"
    t.integer "http_method", default: 0, null: false
    t.json "http_headers"
    t.bigint "tenant_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["name", "tenant_id"], name: "index_webhooks_on_name_and_tenant_id", unique: true
    t.index ["tenant_id"], name: "index_webhooks_on_tenant_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "api_keys", "tenants"
  add_foreign_key "api_keys", "users"
  add_foreign_key "boards", "tenants"
  add_foreign_key "comments", "comments", column: "parent_id"
  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "tenants"
  add_foreign_key "comments", "users"
  add_foreign_key "follows", "posts"
  add_foreign_key "follows", "tenants"
  add_foreign_key "follows", "users"
  add_foreign_key "invitations", "tenants"
  add_foreign_key "likes", "posts"
  add_foreign_key "likes", "tenants"
  add_foreign_key "likes", "users"
  add_foreign_key "o_auths", "tenants"
  add_foreign_key "post_status_changes", "post_statuses"
  add_foreign_key "post_status_changes", "posts"
  add_foreign_key "post_status_changes", "tenants"
  add_foreign_key "post_status_changes", "users"
  add_foreign_key "post_statuses", "tenants"
  add_foreign_key "posts", "boards"
  add_foreign_key "posts", "post_statuses"
  add_foreign_key "posts", "tenants"
  add_foreign_key "posts", "users"
  add_foreign_key "tenant_billings", "tenants"
  add_foreign_key "tenant_default_o_auths", "o_auths"
  add_foreign_key "tenant_default_o_auths", "tenants"
  add_foreign_key "tenant_settings", "tenants"
  add_foreign_key "users", "tenants"
  add_foreign_key "webhooks", "tenants"
end
