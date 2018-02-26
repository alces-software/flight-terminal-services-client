# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180226155134) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pgcrypto"

  create_table "clusters", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string   "auth_token",                  limit: 255,                             null: false
    t.datetime "created_at",                                                          null: false
    t.datetime "updated_at",                                                          null: false
    t.uuid     "user_id"
    t.boolean  "consumes_credits",                                                    null: false
    t.string   "domain"
    t.string   "qualified_name",                                                      null: false
    t.integer  "master_node_cost_per_hour"
    t.string   "cluster_name",                limit: 255,                             null: false
    t.string   "region",                      limit: 64,                              null: false
    t.string   "status",                      limit: 64,  default: "CREATE_COMPLETE", null: false
    t.integer  "max_credit_usage"
    t.boolean  "termination_warning_active",              default: false,             null: false
    t.datetime "termination_warning_sent_at"
    t.index ["user_id"], name: "index_clusters_on_user_id", using: :btree
  end

  create_table "compute_queue_actions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string   "spec",       limit: 255,                     null: false
    t.integer  "min"
    t.integer  "max"
    t.integer  "desired"
    t.string   "action",     limit: 64,                      null: false
    t.string   "status",     limit: 64,  default: "PENDING", null: false
    t.uuid     "cluster_id",                                 null: false
    t.datetime "created_at",                                 null: false
    t.datetime "updated_at",                                 null: false
    t.index ["action"], name: "index_compute_queue_actions_on_action", using: :btree
    t.index ["cluster_id"], name: "index_compute_queue_actions_on_cluster_id", using: :btree
    t.index ["status"], name: "index_compute_queue_actions_on_status", using: :btree
  end

  create_table "credit_usages", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "start_at",                            null: false
    t.datetime "end_at"
    t.float    "queues_cu_in_use",      default: 0.0, null: false
    t.uuid     "cluster_id",                          null: false
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.integer  "master_node_cu_in_use",               null: false
    t.index ["cluster_id"], name: "index_credit_usages_on_cluster_id", using: :btree
  end

  create_table "payments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer  "master_node_cost_per_hour"
    t.integer  "max_credit_usage"
    t.integer  "runtime"
    t.integer  "upfront_cost_per_hour"
    t.string   "payment_method",            limit: 64, null: false
    t.uuid     "cluster_id",                           null: false
    t.uuid     "token_id"
    t.uuid     "user_id"
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.index ["cluster_id"], name: "index_payments_on_cluster_id", using: :btree
    t.index ["token_id"], name: "index_payments_on_token_id", using: :btree
    t.index ["user_id"], name: "index_payments_on_user_id", using: :btree
  end

  create_table "tenants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string   "identifier",             limit: 32,    null: false
    t.string   "name",                   limit: 255,   null: false
    t.string   "header",                 limit: 255
    t.string   "nav_entry",              limit: 255
    t.string   "description",            limit: 10240, null: false
    t.string   "logo_url",               limit: 1024
    t.string   "admin_email",            limit: 255
    t.string   "home_page_url",          limit: 1024
    t.datetime "created_at",                           null: false
    t.datetime "updated_at",                           null: false
    t.string   "email_header",           limit: 255
    t.integer  "remaining_credits"
    t.integer  "max_token_credit_limit"
    t.index ["identifier"], name: "index_tenants_on_identifier", unique: true, using: :btree
  end

  create_table "tokens", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string   "name",                limit: 255
    t.string   "assigned_to",         limit: 255
    t.integer  "credits",                                          null: false
    t.uuid     "tenant_id",                                        null: false
    t.datetime "created_at",                                       null: false
    t.datetime "updated_at",                                       null: false
    t.string   "status",              limit: 64,                   null: false
    t.uuid     "permitted_spec_keys",                                           array: true
    t.string   "tag",                 limit: 1024
    t.boolean  "migrated",                         default: false, null: false
    t.string   "used_by",             limit: 255
    t.datetime "queued_at"
    t.index ["name"], name: "index_tokens_on_name", unique: true, using: :btree
    t.index ["tenant_id"], name: "index_tokens_on_tenant_id", using: :btree
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string   "username",                    limit: 255,                 null: false
    t.string   "email",                       limit: 255,                 null: false
    t.uuid     "flight_id",                                               null: false
    t.datetime "created_at",                                              null: false
    t.datetime "updated_at",                                              null: false
    t.integer  "compute_credits",                         default: 0,     null: false
    t.datetime "credits_last_reduced_at"
    t.datetime "credits_last_updated_at"
    t.boolean  "termination_warning_active",              default: false, null: false
    t.datetime "termination_warning_sent_at"
    t.index ["flight_id"], name: "index_users_on_flight_id", unique: true, using: :btree
    t.index ["username"], name: "index_users_on_username", unique: true, using: :btree
  end

  add_foreign_key "clusters", "users", on_update: :cascade, on_delete: :restrict
  add_foreign_key "compute_queue_actions", "clusters", on_update: :cascade, on_delete: :restrict
  add_foreign_key "credit_usages", "clusters", on_update: :cascade, on_delete: :restrict
  add_foreign_key "payments", "clusters", on_update: :cascade, on_delete: :restrict
  add_foreign_key "payments", "tokens", on_update: :cascade, on_delete: :restrict
  add_foreign_key "payments", "users", on_update: :cascade, on_delete: :restrict
  add_foreign_key "tokens", "tenants", on_update: :cascade, on_delete: :restrict
end
