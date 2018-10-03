data = [
    ['A00', 'dsdfb'],
    ['A00', 'asdf'],
    ['B12', 'fff'],
    ['A94', 'qw124fd'],
    ['E11', 'gfgdfg'],
    ['C04', 'sadg'],
]

sorted_data = sorted(data, key=lambda item: (int(item.partition(' ')[0]) if item[0].isdigit() else float('inf'), item))

print(sorted_data)
