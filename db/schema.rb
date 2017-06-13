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

ActiveRecord::Schema.define(version: 20170516223337) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_trips", force: :cascade do |t|
    t.text     "active_trip_id"
    t.integer  "user_id"
    t.integer  "driver_id"
    t.integer  "trip_request_id"
    t.string   "map_provider"
    t.string   "map_provider_url"
    t.string   "destination_street"
    t.string   "destination_city"
    t.string   "destination_state"
    t.string   "destination_postalcode"
    t.string   "destination_longitude"
    t.string   "destination_latitude"
    t.string   "map_provider_destination_id"
    t.string   "map_provider_destination_slug"
    t.datetime "trip_start_time"
    t.datetime "driver_connect_time"
    t.datetime "trip_end_time"
    t.text     "route_data"
    t.string   "status"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.index ["driver_id"], name: "index_active_trips_on_driver_id", using: :btree
    t.index ["trip_request_id"], name: "index_active_trips_on_trip_request_id", using: :btree
    t.index ["user_id"], name: "index_active_trips_on_user_id", using: :btree
  end

  create_table "completed_trips", force: :cascade do |t|
    t.text     "completed_trip_id"
    t.integer  "user_id"
    t.integer  "driver_id"
    t.integer  "trip_request_id"
    t.integer  "active_trip_id"
    t.string   "map_provider"
    t.string   "map_provider_url"
    t.string   "destination_street"
    t.string   "destination_city"
    t.string   "destination_state"
    t.string   "destination_postalcode"
    t.string   "destination_longitude"
    t.string   "destination_latitude"
    t.string   "map_provider_destination_id"
    t.string   "map_provider_destination_slug"
    t.datetime "completed_trip_end_time"
    t.string   "status"
    t.float    "total_miles"
    t.string   "payment_status"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.index ["active_trip_id"], name: "index_completed_trips_on_active_trip_id", using: :btree
    t.index ["driver_id"], name: "index_completed_trips_on_driver_id", using: :btree
    t.index ["trip_request_id"], name: "index_completed_trips_on_trip_request_id", using: :btree
    t.index ["user_id"], name: "index_completed_trips_on_user_id", using: :btree
  end

  create_table "driver_current_statuses", force: :cascade do |t|
    t.string   "driver_id"
    t.string   "status"
    t.string   "current_longitude"
    t.string   "current_latitude"
    t.string   "trip_status"
    t.text     "trip_request_id"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "driver_receive_payment_methods", force: :cascade do |t|
    t.string   "driver_id"
    t.string   "name"
    t.string   "description"
    t.string   "method"
    t.string   "account_number"
    t.string   "routing_number"
    t.string   "expiration_date"
    t.string   "cv"
    t.string   "method_pic_url"
    t.string   "user_name_on_method"
    t.string   "billing_address_street"
    t.string   "billing_address_city"
    t.string   "billing_address_state"
    t.string   "billing_address_postalcode"
    t.string   "billing_address_country"
    t.string   "status"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "drivers", force: :cascade do |t|
    t.string   "driver_id"
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
    t.string   "street"
    t.string   "city"
    t.string   "state"
    t.string   "postalcode"
    t.string   "telephone_number"
    t.string   "dob"
    t.string   "ssn"
    t.string   "driver_pic_url"
    t.string   "driver_license_pic_url"
    t.string   "ss_card_pic_url"
    t.string   "additional_id_pic_url"
    t.string   "status"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  create_table "payment_methods", force: :cascade do |t|
    t.string   "user_id"
    t.string   "name"
    t.string   "description"
    t.string   "method"
    t.string   "account_number"
    t.string   "routing_number"
    t.string   "expiration_date"
    t.string   "cv"
    t.string   "method_pic_url"
    t.string   "user_name_on_method"
    t.string   "billing_address_street"
    t.string   "billing_address_city"
    t.string   "billing_address_state"
    t.string   "billing_address_postalcode"
    t.string   "billing_address_country"
    t.string   "status"
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "trip_requests", force: :cascade do |t|
    t.text     "trip_request_id"
    t.string   "user_id"
    t.string   "map_provider"
    t.string   "map_provider_url"
    t.string   "destination_street"
    t.string   "destination_city"
    t.string   "destination_state"
    t.string   "destination_postalcode"
    t.string   "destination_longitude"
    t.string   "destination_latitude"
    t.string   "map_provider_destination_id"
    t.string   "map_provider_destination_slug"
    t.string   "pickup_street"
    t.string   "pickup_city"
    t.string   "pickup_state"
    t.string   "pickup_postalcode"
    t.string   "pickup_longitude"
    t.string   "pickup_latitude"
    t.string   "map_provider_pickup_id"
    t.string   "map_provider_pickup_slug"
    t.string   "status"
    t.datetime "created_at",                    null: false
    t.datetime "updated_at",                    null: false
    t.index ["trip_request_id"], name: "index_trip_requests_on_trip_request_id", unique: true, using: :btree
  end

  create_table "users", force: :cascade do |t|
    t.string   "user_id"
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
    t.string   "street"
    t.string   "city"
    t.string   "state"
    t.string   "postalcode"
    t.string   "telephone_number"
    t.string   "email_address_1"
    t.string   "email_address_2"
    t.string   "email_address_3"
    t.string   "id_pic_url"
    t.string   "additional_id_pic_url"
    t.string   "nickname"
    t.text     "icon"
    t.string   "status"
    t.datetime "created_at",            null: false
    t.datetime "updated_at",            null: false
  end

  add_foreign_key "active_trips", "drivers"
  add_foreign_key "active_trips", "trip_requests"
  add_foreign_key "active_trips", "users"
  add_foreign_key "completed_trips", "active_trips"
  add_foreign_key "completed_trips", "drivers"
  add_foreign_key "completed_trips", "trip_requests"
  add_foreign_key "completed_trips", "users"
end
