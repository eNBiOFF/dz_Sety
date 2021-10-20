// const code = require("./js/functions");
// const er_binary = require("./js/er");
// const decode = require("./js/decode");
function code(str, er_dic) {
    // str -  полученная бинарная последовательность путем кодирвоания по коду хэмминга Х[7,4]
    // er_dic - сгенерированный массив ошибок
    let str_arr = [];
    let tmp = parseInt(str, 2);
    let tmp_str = '';
    for (let i = 0; i < er_dic.length; i++) {
        tmp_str = (tmp ^ parseInt(er_dic[i], 2)).toString(2);
        while (tmp_str.length < str.length) {
            tmp_str = "0" + tmp_str;
        }
        str_arr.push(tmp_str);
    }
    return str_arr;
}

var str = [];
var arr = [];

function er_binary(num, k) {
    // num - длина двоичного кода
    // k - количество единиц, которое должно быть в векторах ошибок
    if (num < k) return;
    if (num == 0) { arr.push(str.join('')); return; }
    str.push('0');
    er_binary(num - 1, k);
    str.pop();
    if (k >= 1) {
        str.push('1');
        er_binary(num - 1, k - 1);
        str.pop();
    }
    return arr;
}


function lislice(str, index, arr, No) {
    // str - входная строка для изменения 
    // i -  позиция символа для инвертирования

    let res = [];
    if (index > 0) {
        No++;
        console.log(No)
    }
    index = str.length - index;
    console.log(index);
    console.log(arr);

    for (let i = 0; i < str.length; i++) {
        if (i == index) {
            res.push((parseInt(str[i], 2) ^ 1).toString(2));
        } else {
            res.push(str[i]);
        }
    }
    return { rs: res.join(''), numb: No }
}
// вспомогательная функция замены символа в строке
function plus_mod(a, b) {
    return (a | b) & !(a & b)
}
// функция сложения по модулую 2
function syndrome(str) {
    // str - кодовая комбинация для поиска синдрома ошибки
    let syn_arr = [];
    let tmp = '';
    tmp = plus_mod(str[str.length - 1], str[str.length - 3]);
    tmp = plus_mod(tmp, str[str.length - 5]);
    tmp = plus_mod(tmp, str[str.length - 7]);
    syn_arr.push(tmp);
    tmp = plus_mod(str[str.length - 2], str[str.length - 3]);
    tmp = plus_mod(tmp, str[str.length - 6]);
    tmp = plus_mod(tmp, str[str.length - 7]);
    syn_arr.push(tmp);
    tmp = plus_mod(str[str.length - 4], str[str.length - 5]);
    tmp = plus_mod(tmp, str[str.length - 6]);
    tmp = plus_mod(tmp, str[str.length - 7]);
    syn_arr.push(tmp);
    return syn_arr.reverse().join('');
}
// находим синдром ошибки 
let noer_str = { rs: '', numb: 0 }
    // декудируем сообщение и cчитаем исправленные ошибки
function decode(str_arr, arr) {
    // str_arr - массив полученных кодовых комбинаций с ошибками 

    let N = 0;
    noer_str.numb = 0;
    for (let i = 0; i < str_arr.length; i++) {
        let syn = syndrome(str_arr[i]);
        // console.log(syn);
        let index = parseInt(syn, 2);
        // console.log(str_arr[i]);
        noer_str = lislice(str_arr[i], index, arr[i], noer_str.numb);

        if (noer_str.rs == '1010010') {
            N++;
            // console.log('ошибка исправлена')
        } else {
            // console.log(noer_str);
            // console.log('ошибка не исправлена')
        }
    }
    return { isp: N, obn: noer_str.numb };

}

const inp = document.getElementById('inp');
const N = document.getElementById('n');
const C = document.getElementById('c');
const corr_spos = document.getElementById('corr_spos');
const but = document.getElementById('but');
const info_vhod = document.getElementById('info_vhod');
console.log('lol')
let n = {};
let cd_arr = [];
but.addEventListener('click', () => {
    arr = [];
    cd_arr = []
    er_binary(7, parseInt(inp.value));
    cd_arr = code('1010010', arr);
    n = decode(cd_arr, arr);
    console.log(n.isp)
    N.innerHTML = 'Количество исправленных ошибок: ' + n.isp;
    C.innerHTML = 'Количество обнаруженных ошибок ' + n.obn;
    corr_spos.innerHTML = 'Корректирующая способность: ' + Math.floor(n.isp / cd_arr.length) * 100 + '%';
})