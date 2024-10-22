monto = float(input("Ingrese el monto del préstamo: "))
plazo = int(input("Ingrese el plazo en meses: "))
if monto <= 0 or plazo <= 0:
    print("Monto o plazo inválido")
    
if monto <= 5000:
    if plazo <= 12:
        interes = 0.05
    else:
        interes = 0.07
elif monto <= 20000:
    if plazo <= 24:
        interes = 0.06
    else:
        interes = 0.08
else:
    if plazo <= 36:
        interes = 0.09
    else:
        interes = 0.11
interes = interes * 100
print(f'El interés aplicado es del {interes}%')