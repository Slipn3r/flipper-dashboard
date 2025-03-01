// This file was generated by lezer-generator. You probably shouldn't edit it.
import { LRParser } from '@lezer/lr'
const spec_String = {
  __proto__: null,
  Filetype: 8,
  Version: 12,
  Key: 18,
  type: 20,
  Data: 24
}
export const parser = LRParser.deserialize({
  version: 14,
  states:
    "#fQYQPOOOhQPO'#CrOOQO'#Cn'#CnOOQO'#Cj'#CjQYQPOOOmQPO'#CoOrQPO'#CqOwQPO'#CdO|QPO'#CsO!RQQO,59^OOQO-E6h-E6hO!WQQO,59ZO!]QPO,59]OOQO,59O,59OO!bQSO,59_OOQO1G.x1G.xOOQO1G.u1G.uOOQO1G.w1G.wOOQO1G.y1G.y",
  stateData:
    '!g~OaOSPOS~OSTOUUOXVO[WO~OdXO~OdZO~Od[O~OY]O~Od^O~OZ_O~OT`O~OVaO~O]bO~O',
  goto: '{hPPPPPPPPiPPPPPmPPPswPwwwTPOSQSORYSTROSTQOS',
  nodeNames:
    '⚠ LineComment Program String Filetype FiletypeValue Version Integer KeyType Key type TypeValue Data DataRfid',
  maxTerm: 23,
  skippedNodes: [0, 1, 3],
  repeatNodeCount: 1,
  tokenData:
    "!&u~RmX^!|pq!|st#q}!O$Y!Q![$n![!]'V!c!d'b!d!g)Y!g!h+_!h!i.S!i!j$Y!j!k6v!k!l=r!l!mHQ!m!r$Y!r!sLg!s!x$Y!x!y!#}!y!}$Y#R#S$Y#T#o$Y#y#z!|$f$g!|#BY#BZ!|$IS$I_!|$I|$JO!|$JT$JU!|$KV$KW!|&FU&FV!|~#RYa~X^!|pq!|#y#z!|$f$g!|#BY#BZ!|$IS$I_!|$I|$JO!|$JT$JU!|$KV$KW!|&FU&FV!|~#vSP~OY#qZ;'S#q;'S;=`$S<%lO#q~$VP;=`<%l#qP$_TRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#o$YT$sQVP!Q![$y!c!i&[T%Q[]SVPX^%vpq%v!Q![$n!c!i&R#y#z%v$f$g%v#BY#BZ%v$IS$I_%v$I|$JO%v$JT$JU%v$KV$KW%v&FU&FV%vS%{Q]S!Q![&R!c!i&RS&UQ!Q![&[!c!i&[S&a[]SX^%vpq%v!Q![&R!c!i&R#y#z%v$f$g%v#BY#BZ%v$IS$I_%v$I|$JO%v$JT$JU%v$KV$KW%v&FU&FV%v~'YPpq']~'bOd~V'gWRP}!O$Y!Q![(P!c!i(P!i!y$Y!y!z)q!z!}$Y#R#S$Y#T#o$YT(W`]SRPX^%vpq%v}!O$Y!Q![)Y!c!i)Y!i!}$Y#R#S$Y#T#o$Y#y#z%v$f$g%v#BY#BZ%v$IS$I_%v$I|$JO%v$JT$JU%v$KV$KW%v&FU&FV%vT)_URP}!O$Y!Q![(P!c!i(P!i!}$Y#R#S$Y#T#o$YR)vVRP}!O$Y!Q![$Y!c!k$Y!k!l*]!l!}$Y#R#S$Y#T#o$YR*bVRP}!O$Y!Q![$Y!c!f$Y!f!g*w!g!}$Y#R#S$Y#T#o$YR+OTRPZQ}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#o$YV+dWRP}!O$Y!Q![(P!c!i(P!i!o$Y!o!p+|!p!}$Y#R#S$Y#T#o$YR,RVRP}!O$Y!Q!U$Y!U!V,h!V![$Y!c!}$Y#R#S$Y#T#o$YR,mVRP}!O$Y!Q!R$Y!R!S-S!S![$Y!c!}$Y#R#S$Y#T#o$YR-XURP}!O$Y!Q!R-k!R![$Y!c!}$Y#R#S$Y#T#o$YR-pURP}!O$Y!Q!R*w!R![$Y!c!}$Y#R#S$Y#T#o$YV.XYRP}!O$Y!Q![(P!c!f(P!f!g.w!g!i(P!i!}$Y#R#S$Y#T#`$Y#`#a1W#a#o$YV/Ob]SRPX^%vpq%v}!O$Y!Q![)Y!c!i)Y!i!z$Y!z!{0W!{!}$Y#R#S$Y#T#o$Y#y#z%v$f$g%v#BY#BZ%v$IS$I_%v$I|$JO%v$JT$JU%v$KV$KW%v&FU&FV%vR0]TRP}!O0l!Q![$Y!c!}$Y#R#S$Y#T#o$YR0qVRP}!O$Y!Q![$Y!c!d*w!d!e*w!e!}$Y#R#S$Y#T#o$YR1]VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#]$Y#]#^1r#^#o$YR1wVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#d$Y#d#e2^#e#o$YR2cVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#d$Y#d#e2x#e#o$YR2}VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#X$Y#X#Y3d#Y#o$YR3iVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#f$Y#f#g4O#g#o$YR4T_RPX^5Spq5S}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#o$Y#y#z5S$f$g5S#BY#BZ5S$IS$I_5S$I|$JO5S$JT$JU5S$KV$KW5S&FU&FV5SQ5VP!t!u5YQ5]P!h!i5`Q5cP!k!l5fQ5iP!f!g5lQ5oYX^6_pq6_#y#z6_$f$g6_#BY#BZ6_$IS$I_6_$I|$JO6_$JT$JU6_$KV$KW6_&FU&FV6_Q6bP#_#`6eQ6hP#X#Y6kQ6nP#m#n6qQ6vOTQR6{XRP}!O$Y!Q!R$Y!R!S7h!S![$Y!c!k$Y!k!l9n!l!}$Y#R#S$Y#T#o$YR7mURP}!O$Y!Q!R8P!R![$Y!c!}$Y#R#S$Y#T#o$YR8UVRP}!O$Y!Q!T$Y!T!U8k!U![$Y!c!}$Y#R#S$Y#T#o$YR8pURP}!O$Y!Q!R9S!R![$Y!c!}$Y#R#S$Y#T#o$YR9XVRP}!O$Y!Q!R$Y!R!S*w!S![$Y!c!}$Y#R#S$Y#T#o$YR9sVRP}!O$Y!Q![$Y!c!f$Y!f!g:Y!g!}$Y#R#S$Y#T#o$YR:_XRP}!O$Y!Q![$Y!c!g$Y!g!h:z!h!r$Y!r!s<Q!s!}$Y#R#S$Y#T#o$YR;PVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#l$Y#l#m;f#m#o$YR;kVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#h$Y#h#i*w#i#o$YR<VVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#f$Y#f#g<l#g#o$YR<qVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#c$Y#c#d=W#d#o$YR=]VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#l$Y#l#m*w#m#o$YR=wZRP}!O$Y!Q![$Y!c!q$Y!q!r>j!r!}$Y#R#S$Y#T#W$Y#W#XBh#X#b$Y#b#cDt#c#o$YR>oVRP}!O$Y!Q![$Y!c!r$Y!r!s?U!s!}$Y#R#S$Y#T#o$YR?ZVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#f$Y#f#g?p#g#o$YR?uVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#c$Y#c#d@[#d#o$YR@aVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#l$Y#l#m@v#m#o$YR@{VRP}!O$Y!Q![$Y!c!z$Y!z!{Ab!{!}$Y#R#S$Y#T#o$YRAgVRP}!O$Y!Q![$Y!c!u$Y!u!vA|!v!}$Y#R#S$Y#T#o$YRBRVRP}!O$Y!Q![$Y!c!h$Y!h!i*w!i!}$Y#R#S$Y#T#o$YRBmVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#h$Y#h#iCS#i#o$YRCXVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#X$Y#X#YCn#Y#o$YRCsVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#V$Y#V#WDY#W#o$YRD_VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#_$Y#_#`*w#`#o$YRDyVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#W$Y#W#XE`#X#o$YREeURP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#UEw#U#o$YRE|VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#`$Y#`#aFc#a#o$YRFhURP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#UFz#U#o$YRGPVRP}!O$Y!Q!S$Y!S!TGf!T![$Y!c!}$Y#R#S$Y#T#o$YRGkVRP}!O$Y!Q!W$Y!W!X*w!X![$Y!c!}$Y#R#S$Y#T#o$YRHVURP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#UHi#U#o$YRHnVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#U$Y#U#VIT#V#o$YRIYVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#`$Y#`#aIo#a#o$YRItVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#c$Y#c#dJZ#d#o$YRJ`VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#h$Y#h#iJu#i#o$YRJzVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#f$Y#f#gKa#g#o$YRKfVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#c$Y#c#dK{#d#o$YRLQVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#b$Y#b#c*w#c#o$YRLlWRP}!O$Y!Q![$Y!c!dMU!d!}$Y#R#S$Y#T#m$Y#m#n! Y#n#o$YRMZVRP}!O$Y!Q![$Y!c!e$Y!e!fMp!f!}$Y#R#S$Y#T#o$YRMuURP}!O$Y!P!QNX!Q![$Y!c!}$Y#R#S$Y#T#o$YQN[P!u!vN_QNbP#h#iNeQNhP#T#UNkQNnP#b#cNqQNtP#`#aNwQNzP#X#YN}Q! QP#m#n! TQ! YOZQR! _VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#f$Y#f#g! t#g#o$YR! yURP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#U!!]#U#o$YR!!bVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#a$Y#a#b!!w#b#o$YR!!|VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#]$Y#]#^!#c#^#o$YR!#hVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#W$Y#W#X*w#X#o$YR!$SVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#]$Y#]#^!$i#^#o$YR!$nVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#_$Y#_#`!%T#`#o$YR!%YVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#]$Y#]#^!%o#^#o$YR!%tVRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#b$Y#b#c!&Z#c#o$YR!&`VRP}!O$Y!Q![$Y!c!}$Y#R#S$Y#T#Z$Y#Z#[*w#[#o$Y",
  tokenizers: [0, 1, 2],
  topRules: { Program: [0, 2] },
  specialized: [{ term: 3, get: (value) => spec_String[value] || -1 }],
  tokenPrec: 0
})
