require 'json'

get '/' do
  @distilleries = Distillery.all
  @column_names = Distillery.column_names.map(&:capitalize).reject{|column| column == "Id" || column == "Name"}
  erb :index
end

get '/attributes/:attr' do
  # quality = params[:attribute].downcase
  # @distilleries = Distillery.where("#{quality} > ?", 2).order("#{quality} asc").map do |x|
  #   {name: x.name, score: x[quality]}
  p params
  @distillery = Distillery.find_by_name(params[:attribute]).attributes.reject{|x| x=="name"||x=="id"}

  content_type 'application/json'
  { :distillery => @distillery }.to_json
end