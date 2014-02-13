require 'json'

get '/' do
  @distilleries = Distillery.all
  @column_names = Distillery.column_names.map(&:capitalize).reject{|column| column == "Id" || column == "Name"}
  erb :index
end

get '/attributes' do 
  @distilleries = Distillery.where(name: params[:distilleries]).map do |distillery| 
    distillery.attributes.reject{|attribute| attribute == "id"}
  end

  content_type 'application/json'
  halt 200, { :distillery => @distilleries }.to_json
end