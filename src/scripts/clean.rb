first_arr = File.readlines("data/en-EN.src.txt")
second_arr = File.readlines("data/de-DE.src.txt")

processed_first = []
processed_second = []

first_arr.each do |line_first|
  line_first_arr = line_first.rstrip.split(" = ")
  second_arr.each do |line_second|
    line_second_arr = line_second.rstrip.split(" = ")
    if (line_second_arr[1] != "\"\";" && line_first_arr[0] == line_second_arr[0])
      processed_first << line_first
      processed_second << line_second
      break
    end
  end
end


File.open("data/en-EN.txt", "w").puts(processed_first)
File.open("data/de-DE.txt", "w").puts(processed_second)


