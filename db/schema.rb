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

ActiveRecord::Schema.define(version: 20170227164449) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_trips", force: :cascade do |t|
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
    t.integer  "user_id"
    t.string   "start_address_street"
    t.string   "start_address_city"
    t.string   "start_address_state"
    t.string   "start_address_zip"
    t.string   "destination_street"
    t.string   "destination_city"
    t.string   "destination_state"
    t.string   "destination_zip"
    t.datetime "start_time"
    t.integer  "driver_id"
    t.string   "status"
    t.index ["driver_id"], name: "index_active_trips_on_driver_id", using: :btree
    t.index ["user_id"], name: "index_active_trips_on_user_id", using: :btree
  end

  create_table "completed_trips", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "start_address_street"
    t.string   "start_address_city"
    t.string   "start_address_state"
    t.string   "start_address_zip"
    t.string   "destination_street"
    t.string   "destination_city"
    t.string   "destination_state"
    t.string   "destination_zip"
    t.integer  "driver_id"
    t.datetime "start_time"
    t.datetime "end_time"
    t.string   "status"
    t.float    "total_miles"
    t.index ["driver_id"], name: "index_completed_trips_on_driver_id", using: :btree
    t.index ["user_id"], name: "index_completed_trips_on_user_id", using: :btree
  end

  create_table "drivers", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "street"
    t.string   "city"
    t.string   "state"
    t.string   "zip"
    t.string   "telephone_number"
    t.string   "dob"
    t.string   "ssn"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "hotels", force: :cascade do |t|
    t.string   "name"
    t.string   "street_address"
    t.string   "city"
    t.string   "zip"
    t.string   "longitude"
    t.string   "latitude"
    t.string   "ip_address"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "nickname"
    t.text     "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "hotel_name"
  end

  add_foreign_key "active_trips", "drivers"
  add_foreign_key "active_trips", "users"
end
