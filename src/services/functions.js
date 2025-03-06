export function getValue(value){
    return value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}