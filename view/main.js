window.state = new device.state({
    result: new Array(),
    display: '',
})

function getResult(){
    try { 
        const opr = window.state.get('display');
        const data = opr.replace(/×/gi,'*')
                        .replace(/÷/gi,'/')
        window.state.set(state=>({ 
            result: [
                [opr+'='+eval(data),true],
                ...state.result
            ],  display: '',
        }));
    } catch(e) { console.log(e);
        window.state.set(state=>({
            result: [
                ['ERROR',false],
                ...state.result
            ],  display: '',
        })); 
    }
}

window.action = function(element){
    if( (/number|sign/).test(element.getAttribute('type')) )
        window.state.set(state=>({
            display: state.display + element.innerText
        }));
    
    if( (/action/).test(element.getAttribute('type')) )
    switch( element.innerText ){
        case 'AC': window.state.set({ display: '', result: [] }); break;
        case '=': getResult(); break;
        case 'DEL': 
            let lcd = Array.from(window.state.get('display'));
                lcd.pop();
            window.state.set({ display: lcd.join('') });
        break;
    }
}

window.state.observeField('result',(prev,act)=>{
    $('[carryLCD]').innerHTML = act.map(x=>`
        <div class="uk-text-${ !x[1] ? 'danger' : 'success' }"> 
            ${x[0]} 
        </div>
    `).slice(0,3).join('');  
})

window.state.observeField('display',(prev,act)=>{
    $('[mainLCD]').innerText = act;
});