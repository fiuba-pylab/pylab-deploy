def producto(nat1, nat2):
    sumas = 0
    resultado = 0
    if nat1 <= nat2:
        while sumas < nat1:
            sumas += 1
            resultado += nat2
    else:
        while sumas < nat2:
            sumas += 1
            resultado += nat1
    return resultado

def divresto(dividendo, divisor):
    resto = dividendo
    cociente = 0
    while resto >= divisor:
        cociente += 1
        resto -= divisor
    return cociente, resto

operador = input('Ingrese * para producto, o / para división y resto: ')
while operador == '*' or operador == '/':
    a = int(input('Primer operando: '))
    b = int(input('Segundo operando: '))
    if operador == '*':
       prod = producto(a, b)
       print(f'El producto es {prod}')
    else:
        cociente, resto = divresto(a, b)
        print(f'El cociente es {cociente}, y el resto {resto}')
    operador = input('Ingrese * para producto, / para división y resto, otra cosa para terminar: ')
