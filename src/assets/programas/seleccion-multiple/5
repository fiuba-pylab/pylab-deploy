numero = int(input('Ingrese un número entero: '))
unidad = numero % 10
decena = (numero // 10) % 10
centena = (numero // 100) % 10
unidad_mil = numero // 1000

if unidad < 4:
    ur = unidad*'I'
elif 4 < unidad and unidad < 9:
    multiply_factor = (unidad-5)*'I'
    ur = 'V' + multiply_factor
elif unidad == 4:
    ur = 'IV'
else:
    ur = 'IX'

if decena < 4:
    dr = decena*'X'
elif 4 < decena and decena < 9:
    multiply_factor = (decena-5)*'X'
    dr = 'L' + multiply_factor
elif decena == 4:
    dr = 'XL'
else:
    dr = 'XC'

if centena < 4:
    cr = centena*'C'
elif 4 < centena and centena < 9:
    multiply_factor = (centena-5)*'C'
    cr = 'D' + multiply_factor
elif centena == 4:
    cr = 'CD'
else:
    cr = 'CM'

mr = unidad_mil*'M'
romano = mr + cr + dr + ur 
print(f'\nLa representación romana de {numero} es {romano}')