import math

real = int(input("ingrese el real: "))
imaginario = int(input("ingrese el imaginario: "))
if (real > 0 and imaginario > 0):
    result = 180 * math.asin(imaginario/math.sqrt(real * real + imaginario * imaginario))
    print(f'\n El resultado es {result}')
elif (real < 0 and imaginario > 0):
    result = 180 * (math.asin(real/math.sqrt(real * real + imaginario * imaginario)) + 1/2)
    print(f'\n El resultado es {result}')
elif (real < 0 and imaginario < 0):
    result = 180 * (math.asin(imaginario/math.sqrt(real * real + imaginario * imaginario))+1)
    print(f'\n El resultado es {result}')
else:
    result = 180 * (math.asin(real/math.sqrt(real * real + imaginario * imaginario)) + 3/2)
    print(f'\n El resultado es {result}')