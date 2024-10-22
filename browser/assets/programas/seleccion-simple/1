fecha = int(input('Ingresar fecha en formato aaaammdd: '))

A = (fecha // 10000) % 100
C = (fecha // 10000) // 100
m = (fecha % 10000) // 100
d = (fecha % 10000) % 100
if m == 1 or m == 2:
    m = m + 12
    A = A - 1
ds = (d + ((m+1)*26)//10 + A + (A//4) + (C//4) + (5*C))%7
if ds == 0:
    print(f'El día de la fecha {fecha} es Sábado')
elif ds == 1:
    print(f'El día de la fecha {fecha} es Domingo')
elif ds == 2:
    print(f'El día de la fecha {fecha} es Lunes')
elif ds == 3:
    print(f'El día de la fecha {fecha} es Martes')
elif ds == 4:
    print(f'El día de la fecha {fecha} es Miércoles')
elif ds == 5:
    print(f'El día de la fecha {fecha} es Jueves')
else:
    print(f'El día de la fecha {fecha} es Viernes')