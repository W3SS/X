/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


function tester(inter,testers){
    var v,i,results={};
    //    Date.
    for(v in testers){
        results[v]={
            start:Date.now()
        };
        for(i=0;i<inter;i++){
            testers[v].call();
        }
        results[v].fn=testers[v];
        results[v].end=Date.now();
        results[v].elapsed=results[v].end-results[v].start; 
    }
    return results;
}


