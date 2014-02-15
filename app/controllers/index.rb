require 'json'

get '/' do
  @distilleries = Distillery.all
  erb :index
end

get '/attributes' do 
  @distilleries = {}
  Distillery.where(name: params[:distilleries]).map do |distillery| 
    @distilleries[distillery.name] = distillery.attributes.reject{ |attribute| attribute == "id" || attribute == "name" }
  end
  content_type 'application/json'
  halt 200, @distilleries.to_json
end