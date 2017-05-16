# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

require 'alces/setup/seeder'
require 'alces/setup/deseeder'

Alces::Setup::Deseeder.destroy_all
Alces::Setup::Seeder.seed
