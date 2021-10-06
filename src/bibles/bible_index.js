const bibleIndex = {
    books: [
        {
            full_name:"Génesis",
            name:"genesis",
            abrv:"gn",
            num:1
        },
        {
            full_name:"Éxodo",
            name:"exodo",
            abrv:"ex",
            num:2
        },
        {
            full_name:"Levítico",
            name:"levitico",
            abrv:"lv",
            num:3
        },
        {
            full_name:"Números",
            name:"numeros",
            abrv:"nm",
            num:4
        },
        {
            full_name:"Deuteronomio",
            name:"deuteronomio",
            abrv:"dt",
            num:5
        },
        {
            full_name:"Josué",
            name:"josue",
            abrv:"jos",
            num:6
        },
        {
            full_name:"Jueces",
            name:"jueces",
            abrv:"jue",
            num:7
        },
        {
            full_name:"Rut",
            name:"rut",
            abrv:"rt",
            num:8
        },
        {
            full_name:"1 Samuel",
            name:"1 samuel",
            abrv:"1 s",
            num:9
        },
        {
            full_name:"2 Samuel",
            name:"2 samuel",
            abrv:"2 s",
            num:10
        },
        {
            full_name:"1 Reyes",
            name:"1 reyes",
            abrv:"1 r",
            num:11
        },
        {
            full_name:"2 Reyes",
            name:"2 reyes",
            abrv:"2 r",
            num:12
        },
        {
            full_name:"1 Crónicas",
            name:"1 cronicas",
            abrv:"1 cr",
            num:13
        },
        {
            full_name:"2 Crónicas",
            name:"2 cronicas",
            abrv:"2 cr",
            num:14
        },
        {
            full_name:"Esdras",
            name:"esdras",
            abrv:"esd",
            num:15
        },
        {
            full_name:"Nehemías",
            name:"nehemias",
            abrv:"neh",
            num:16
        },
        {
            full_name:"Ester",
            name:"ester",
            abrv:"est",
            num:17
        },
        {
            full_name:"Job",
            name:"job",
            abrv:"job",
            num:18
        },
        {
            full_name:"Salmos",
            name:"salmos",
            abrv:"sal",
            num:19
        },
        {
            full_name:"Proverbios",
            name:"proverbios",
            abrv:"pr",
            num:20
        },
        {
            full_name:"Esclesiastés",
            name:"eclesiastes",
            abrv:"ec",
            num:21
        },
        {
            full_name:"Cantares",
            name:"cantares",
            abrv:"cnt",
            num:22
        },
        {
            full_name:"Isaías",
            name:"isaias",
            abrv:"is",
            num:23
        },
        {
            full_name:"Jeremías",
            name:"jeremias",
            abrv:"jer",
            num:24
        },
        {
            full_name:"Lamentaciones",
            name:"lamentaciones",
            abrv:"lm",
            num:25
        },
        {
            full_name:"Ezequiel",
            name:"ezequiel",
            abrv:"ez",
            num:26
        },
        {
            full_name:"Daniel",
            name:"daniel",
            abrv:"dn",
            num:27
        },
        {
            full_name:"Oseas",
            name:"oseas",
            abrv:"os",
            num:28
        },
        {
            full_name:"Joel",
            name:"joel",
            abrv:"jl",
            num:29
        },
        {
            full_name:"Amós",
            name:"amos",
            abrv:"am",
            num:30
        },
        {
            full_name:"Abdías",
            name:"abdias",
            abrv:"abd",
            num:31
        },
        {
            full_name:"Jonás",
            name:"jonas",
            abrv:"jon",
            num:32
        },
        {
            full_name:"Miqueas",
            name:"miqueas",
            abrv:"miq",
            num:33
        },
        {
            full_name:"Nahum",
            name:"nahum",
            abrv:"nah",
            num:34
        },
        {
            full_name:"Habacuc",
            name:"habacuc",
            abrv:"hab",
            num:35
        },
        {
            full_name:"Sofonías",
            name:"sofonias",
            abrv:"sof",
            num:36
        },
        {
            full_name:"Hageo",
            name:"hageo",
            abrv:"hg",
            num:37
        },
        {
            full_name:"Zacarías",
            name:"zacarias",
            abrv:"zac",
            num:38
        },
        {
            full_name:"Malaquías",
            name:"malaquias",
            abrv:"mal",
            num:39
        },
        {
            full_name:"Mateo",
            name:"mateo",
            abrv:"mt",
            num:40
        },
        {
            full_name:"Marcos",
            name:"marcos",
            abrv:"mc",
            num:41
        },
        {
            full_name:"Lucas",
            name:"lucas",
            abrv:"lc",
            num:42
        },
        {
            full_name:"Juan",
            name:"juan",
            abrv:"jn",
            num:43
        },
        {
            full_name:"Hechos",
            name:"hechos",
            abrv:"hch",
            num:44
        },
        {
            full_name:"Romanos",
            name:"romanos",
            abrv:"ro",
            num:45
        },
        {
            full_name:"1 Corintios",
            name:"1 corintios",
            abrv:"1 co",
            num:46
        },
        {
            full_name:"2 Corintios",
            name:"2 corintios",
            abrv:"2 co",
            num:47
        },
        {
            full_name:"Gálatas",
            name:"galatas",
            abrv:"gl",
            num:48
        },
        {
            full_name:"Efesios",
            name:"efesios",
            abrv:"ef",
            num:49
        },
        {
            full_name:"Filipenses",
            name:"filipenses",
            abrv:"flp",
            num:50
        },
        {
            full_name:"Colosenses",
            name:"colosenses",
            abrv:"col",
            num:51
        },
        {
            full_name:"1 Tesalonicenses",
            name:"1 tesalonicenses",
            abrv:"1 ts",
            num:52
        },
        {
            full_name:"2 Tesalonicenses",
            name:"2 tesalonicenses",
            abrv:"2 ts",
            num:53
        },
        {
            full_name:"1 Timoteo",
            name:"1 timoteo",
            abrv:"1 ti",
            num:54
        },
        {
            full_name:"2 Timoteo",
            name:"2 timoteo",
            abrv:"2 ti",
            num:55
        },
        {
            full_name:"Tito",
            name:"tito",
            abrv:"tit",
            num:56
        },
        {
            full_name:"Filemón",
            name:"filemon",
            abrv:"flm",
            num:57
        },
        {
            full_name:"Hebreos",
            name:"hebreos",
            abrv:"heb",
            num:58
        },
        {
            full_name:"Santiago",
            name:"santiago",
            abrv:"stg",
            num:59
        },
        {
            full_name:"1 Pedro",
            name:"1 pedro",
            abrv:"1 p",
            num:60
        },
        {
            full_name:"2 Pedro",
            name:"2 pedro",
            abrv:"2 p",
            num:61
        },
        {
            full_name:"1 Juan",
            name:"1 juan",
            abrv:"1 jn",
            num:62
        },
        {
            full_name:"2 Juan",
            name:"2 juan",
            abrv:"2 jn",
            num:63
        },
        {
            full_name:"3 Juan",
            name:"3 juan",
            abrv:"3 jn",
            num:64
        },
        {
            full_name:"Judas",
            name:"judas",
            abrv:"jud",
            num:65
        },
        {
            full_name:"Apocalipsis",
            name:"apocalipsis",
            abrv:"ap",
            num:66
        }

    ]
}

export default bibleIndex;