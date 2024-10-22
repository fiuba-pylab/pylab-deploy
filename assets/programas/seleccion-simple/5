inicio = int(input('\nIngrese año y mes de inicio laboral como un número aaaamm: ')) 
fin = int(input('Ingrese año y mes de cese laboral como un número aaaamm: '))

anio_i = inicio // 100 
anio_f = fin // 100
mes_i = inicio % 100 
mes_f = fin % 100
anios = anio_f - anio_i
meses = (mes_f - 1) - mes_i
if meses < 0:
    anios -= 1 
    meses += 12
print(f'La antigüedad laboral es de {anios} años', end= ' ')
if meses > 0: 
    print(f'y {meses} meses.')