require 'csv'
class DistilleryImporter
  def self.import(filename)
    distilleries = {}
    locations = {}

    CSV.foreach(filename, headers: true, header_converters: :symbol, converters: :all) do |row|
      row[:postcode].strip!
      distilleries[row[:rowid]]=Hash[row.headers[1..-4].zip(row.fields[1..-4])]
      locations[row[:rowid]]=Hash[row.headers[-3..-1].zip(row.fields[-3..-1])]
    end

    distilleries.each do |distillery, values|
      Distillery.create(values)
    end

    locations.each do |id, values|
      Distillery.find(id).create_location(values)
    end
  end
end