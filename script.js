import { Observable,merge,map,debounceTime,distinctUntilChanged,interval, fromEvent,switchMap } from "rxjs";
import { ajax } from "rxjs/ajax"

const input = document.querySelector("input");
const resultats = document.querySelector(".resultats");

/*
const interval$ = new Observable(observer =>{
    let count = 0;
    setInterval(()=>{
        observer.next(count);
        count++;
    },3000)
})
*/
//const interval$ = interval(1000);
//interval$.subscribe(v=>console.log('Interval : '+ v))

/*
const frappes$ =  new Observable(observer =>{
    input.addEventListener('input',(event)=>{
        observer.next(event)
    })
})
*/
const frappes$ = fromEvent(input,'input')
//frappes$.subscribe(event=> console.log(event.target.value))

const valeurTapee$  = frappes$.pipe(
    map(event => event.target.value),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((valeur)=>ajax("https://geo.api.gouv.fr/communes?nom=" + valeur)),
    map((resultatHttp) => resultatHttp.response)
)

/*
function appelerApi(valeur){
    const ajax$ = new Observable(observer=>{
        fetch("https://geo.api.gouv.fr/communes?nom=" + valeur)
        .then((response) => response.json())
        .then((communes) => observer.next(communes));
    })

    return ajax$;
}
*/


valeurTapee$.subscribe(communes => {
    let communesHtml = communes.map(commune => `<li>${commune.nom} code : (${commune.code})</li>`).join('');

    resultats.innerHTML = `
        <h2>Résultats :</h2>
        <ul>
            ${communesHtml}
        </ul>
    `;
})

/*
const fusion$ = merge(interval$, frappes$);
fusion$.subscribe(valeur =>{
    console.log("J'appel l'API ",valeur)
})
*/

/*
interval$.subscribe(count =>{
    console.log(count)
})

frappes$.subscribe(event => {
    console.log(event.target.value)
});
*/


/**
 * Le résultat attendu via l'utilisation d'RxJS
 */

// const frappes$ = fromEvent(input, "input");

// frappes$
//   .pipe(
//     map((event) => event.target.value),
//     distinctUntilChanged(),
//     debounceTime(500),
//     switchMap((text) => ajax("https://geo.api.gouv.fr/communes?nom=" + text)),
//     map((resultats) => resultats.response)
//   )
//   .subscribe((communes) => {
//     let communesHtml = communes
//       .map((commune) => `<li>${commune.nom} (${commune.code})</li>`)
//       .join("");
//     resultats.innerHTML = `
//         <h2>Résultats : </h2>
//         <ul>
//             ${communesHtml}
//         </ul>
//     `;
//   });
