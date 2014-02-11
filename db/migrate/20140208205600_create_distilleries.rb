class CreateDistilleries < ActiveRecord::Migration
  def change
    create_table :distilleries do |t|
      t.string :name
      t.integer :body, :sweetness, :smoky, :medicinal, :tobacco, :honey, :spicy, :winey, :nutty, :malty, :fruity, :floral
    end

    create_table :locations do |t|
      t.integer :distillery_id, :latitude, :longitude
      t.string :postcode
    end

    add_index(:distilleries, :name)
  end
end