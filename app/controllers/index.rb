require 'json'

get '/' do
  @distilleries = Distillery.all
  @column_names = Distillery.column_names.map(&:capitalize).reject{|column| column == "Id" || column == "Name"}
  erb :index
end

get '/attributes' do
  @distillery = Distillery.find_by_name(params[:distillery]).attributes.reject{|x| x=="name"||x=="id"}
  content_type 'application/json'
  halt 200, { :distillery => @distillery }.to_json
end