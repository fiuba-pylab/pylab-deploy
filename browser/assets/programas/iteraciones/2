n = int(input('Ingrese un entero positivo mayor que 1 para iniciar la búsqueda: '))
analizar = 's'
while analizar == 's':
    print(f'{n}:', end=' ')
    termino = n
    while termino not in {1, 4, 16, 37, 58, 89, 145, 42, 20}:
        sumaC = 0
        while termino != 0: 
            cifra = termino % 10
            termino //= 10
            sumaC += cifra**2
        termino = sumaC
        print(f'{termino}', end=' ')
    if termino == 1:
        print(f'<-- {n} es feliz')
        analizar = 'n'
    else:
        print(f'<-- {n} es infeliz')
        n += 1