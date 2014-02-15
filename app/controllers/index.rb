require 'json'

get '/' do
  @distilleries = Distillery.all
  @column_names = Distillery.column_names.map(&:capitalize).reject{|column| column == "Id" || column == "Name"}
  erb :index
end

get '/attributes' do 
  @distilleries = {}
  Distillery.where(name: params[:distilleries]).map do |distillery| 
    @distilleries[distillery.name] = distillery.attributes.reject{|attribute| attribute == "id" || attribute == "name"}
  end
  p @distilleries
  content_type 'application/json'
  halt 200, @distilleries.to_json
end