def primo(n):
    tope = int(n**0.5)
    if n == 2: 
       return True
    if n % 2 == 0:
       return False
    posibleDivisor = 3
    while posibleDivisor <= tope:
        if n % posibleDivisor == 0:
               return False
        posibleDivisor += 2 
    return True

numero = int(input('Ingrese un entero positivo mayor que 1 para saber si es primo o no: '))
es_primo = primo(numero)
if es_primo:
    print(f'{numero} es un número primo.')
else: 
    print(f'{numero} no es un número primo.')