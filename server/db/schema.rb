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

ActiveRecord::Schema.define(version: 20170523111156) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "pgcrypto"

  create_table "tenants", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string   "identifier",    limit: 32,    null: false
    t.string   "name",          limit: 255,   null: false
    t.string   "header",        limit: 255
    t.string   "nav_entry",     limit: 255
    t.string   "description",   limit: 10240, null: false
    t.string   "logo_url",      limit: 1024
    t.string   "admin_email",   limit: 255
    t.string   "home_page_url", limit: 1024
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "email_header",  limit: 255
    t.index ["identifier"], name: "index_tenants_on_identifier", unique: true, using: :btree
  end

  create_table "tokens", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string   "name",                limit: 255
    t.string   "assigned_to",         limit: 255
    t.integer  "credits"
    t.uuid     "tenant_id",                       null: false
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "status",              limit: 64,  null: false
    t.uuid     "permitted_spec_keys",                          array: true
    t.index ["name"], name: "index_tokens_on_name", unique: true, using: :btree
    t.index ["tenant_id"], name: "index_tokens_on_tenant_id", using: :btree
  end

  add_foreign_key "tokens", "tenants", on_update: :cascade, on_delete: :restrict
end
