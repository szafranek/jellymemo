def file_to_array filename
  result = []
  File.readlines(filename).each do |raw_line|
    raw_line.rstrip!
    raw_line.slice!(-2, 2)
    raw_line[0] = ""
    result << raw_line.split("\" = \"")
  end
  return result
end


first_arr = file_to_array "data/en-EN.src.txt"
second_arr = file_to_array "data/de-DE.src.txt"

merge_arr = []
first_arr.each do |line_from_first|
  match_index = second_arr.find_index do |line_from_second|
    key1 = line_from_first[0]
    key2 = line_from_second[0]
    val1 = line_from_first[1]
    val2 = line_from_second[1]
    key1 == key2 && !val1.nil? && !val2.nil? && val1.length > 1 && val2.length > 1
  end
  if (match_index != nil)
    merge_arr << line_from_first
    second_arr.slice!(match_index)
  end
end





# File.readlines("web/data/en.txt").each do |en_line|
#   key, en_string = en_line.split(" = ")
#   p en_string.strip.sub(/^\"/, "").sub(/\";$/, "")
# end