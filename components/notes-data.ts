const notesData = [
    {
        "date": "2025/07/25",
        "weekday": "周五",
        "author": "小水",
        "location": "厦门市·幸福路",
        "label": "生活方式",
        "emotion": "明亮",
        "content": `
今天是搬到厦门的第一周！特别喜欢现在住的地方，楼下就是最喜欢的街区！！
每家每户都种了很多花，路过会有很香的味道~我还拥有了一扇会吹进海风的窗户！
楼下一条街全是咖啡店，早上我就喜欢买一杯话梅美式（楼下那家的最好喝！！）
坐在窗台上，一边看下方来往的行人，微风吹动着树叶，喝我的街窗咖啡🥰
看到这条的人，如果你哪天来了记得抬头看看，那个蓝色的窗户就是我家，说不定你从楼下路过的时候，还能跟我say hi喔！
        `,
        "coodinates": [119.02460603144189, 25.441532399229455]
    },
    {
        "date": "2024/11/21",
        "weekday": "周四",
        "author": "调酒师小水",
        "location": "厦门市·黄厝海滩",
        "label": "趣味探索",
        "emotion": "嘻嘻",
        "content": `
今天在黄厝海滩请大家喝太平洋ocean
一人插一根吸管，不许多喝哈
        `,
        "coodinates": [118.14987700447894, 24.43232994040233]
    },
    {
        "date": "2024/11/17",
        "weekday": "周日",
        "author": "小水",
        "location": "厦门市·中山公园",
        "label": "趣味探索",
        "emotion": "嘻嘻",
        "content": `
今天在"禁止犬只入内"公园溜了狗！！
[图片]
嘿嘿 今天不想说别的
来看我家宝宝吧！！
[图片]
我有狗啦——
不跟没狗的人说话
——————！
        `,
        "coodinates": [118.08852040724548, 24.458808473269052]
    },
    {
        "date": "2025/07/14",
        "weekday": "周日",
        "author": "庙口等戏班",
        "location": "泉州市·安海镇",
        "label": "文化探索",
        "emotion": "暖意",
        "content": `
今天去安海，看一场庙口大戏。
小朋友们踩在凳子上，阿婆拿着蒲扇，台上锣鼓一响，整个巷子都跟着热闹起来。
一个老大爷和我聊起他们的"送王船"，说那是驱疫祈福，几百年没断过。
夜幕下，戏声在风里飘，我心里突然很平静，觉得时间其实没有走远。
如果你也来泉州，别错过这样的夏夜，它们不会出现在任何旅游攻略里。
        `,
        "coodinates": [118.47685593682974, 24.71746491769805]
    },
    {
        "date": "2025/07/21",
        "weekday": "周日",
        "author": "庙口吹凉风",
        "location": "泉州市·安溪",
        "label": "文化探索",
        "emotion": "暖意",
        "content": `
傍晚，庙口的小戏台又搭起来了。
锣鼓一响，小孩疯跑，大人搬板凳占位子，
戏台旁边摆满了炸枣、花生糖的摊子，香味飘一条街。
唱戏的是老班子，嗓子亮得像铜锣，
唱到一半，旁边的阿伯大喊"返场"，我笑到喷茶。
如果你来福建，别只去景区，找个庙口，听一晚戏，才知道生活有多热闹。
        `,
        "coodinates": [118.48959112219318, 25.182123396086823]
    },
    {
        "date": "2025/07/11",
        "weekday": "周五",
        "author": "海风吹船公",
        "location": "厦门市·海沧村",
        "label": "文化探索",
        "emotion": "炽烈",
        "content": `
今天是"送王船"的日子，整个村子的人都出来了。
一艘巨大的木船抬到沙滩，船身画满神兽和花纹，彩带随风飘。
老人们嘴里念咒，纸钱像金色的雨落下，火光把海照得通红。
我站在海风里，看船一点点被烧掉，心里突然觉得人真渺小，
但也觉得这片海真的会记住我们。
如果你哪天来厦门，遇到这种日子，一定要去海边看看，真的震撼。
        `,
        "coodinates": [117.97989703726086, 24.46080505297422]
    },
    {
        "date": "2025/07/24",
        "weekday": "周四",
        "author": "鱼丸别加香菜",
        "location": "厦门市·八市",
        "label": "趣味发现",
        "emotion": "明亮",
        "content": `
早市真的比夜店还刺激，五点多我就被人流推着走。
阿姨一边剁鱼，一边骂隔壁摊"你这虾昨天的吧！"
我正盯着一堆活蛤蜊，它突然全开壳，吓得我手机差点掉地上😂
买了海蛎煎，老板还教我："要加蒜泥，厦门味才正。"
八市的烟火气，呛得你眼泪流，还想明天再来！
        `,
        "coodinates": [118.07443732432368, 24.458723076805825]
    },
    {
        "date": "2025/07/19",
        "weekday": "周六",
        "author": "庙口蹲瓜子",
        "location": "泉州市·安海",
        "label": "文化探索",
        "emotion": "暖意",
        "content": `
庙埕今晚真的热闹炸裂！
锣鼓一响，小孩疯跑，大人抢板凳，阿婆喊"坐我旁边，年轻人别站着！"
我一边啃瓜子，一边看戏班的小生甩水袖，动作飘得像风。
旁边阿伯还跟我科普："这戏唱的是状元郎的故事，懂不？"
我假装点头，其实心里全在想——
这巷子，这灯光，这笑声，比任何电影都生动。
        `,
        "coodinates": [118.47646969873409, 24.717386950729022]
    },
    {
        "date": "2025/07/16",
        "weekday": "周三",
        "author": "骑电瓶的诗人",
        "location": "厦门市·环岛路",
        "label": "漫步灵感",
        "emotion": "安然",
        "content": `
晚上九点，骑电瓶沿着海边狂飙，风吹得耳朵疼，但好爽。
对面骑车的小哥突然冲我喊："别开远光啊兄弟！"我笑到差点撞栏杆。
停在椰子树旁，吹海风，月亮挂在浪尖上，像一块掉进水里的糖。
厦门的夜啊，适合跑风，适合放空，适合突然想起某个人又忍住不发消息。
        `,
        "coodinates": [118.1082954890896, 24.430514879004914]
    },
    {
        "date": "2025/07/23",
        "weekday": "周三",
        "author": "榕树下喝茶",
        "location": "泉州市·东街",
        "label": "生活方式",
        "emotion": "安然",
        "content": `
老茶馆的木门嘎吱响，风吹动帘子，带进一丝檀香味。
我点了一壶铁观音，老板慢悠悠地说："喝茶，不急。"
阳光从窗棂漏下来，落在桌上的茶盏上，水汽慢慢升起，
那一刻，我觉得时间终于停下来了。
        `,
        "coodinates": [119.29928926822994, 26.086146336408298]
    },
    {
        "date": "2025/07/18",
        "weekday": "周五",
        "author": "猫趴在锅边",
        "location": "厦门市·曾厝垵",
        "label": "趣味发现",
        "emotion": "明亮",
        "content": `
小巷里有家烧烤摊，老板烤鱿鱼，香味弥漫到半条街。
旁边的猫趴在炉边，眼睛亮得像灯泡，还盯着扇贝不眨眼。
我笑着问老板："它每天都在这儿？"
他乐呵呵："嗯，专职监工。"
厦门的夜市，连猫都带点烟火浪漫。
        `,
        "coodinates": [118.12628907428955, 24.43122785815547]
    },
    {
        "date": "2025/07/15",
        "weekday": "周二",
        "author": "凌晨吃血粑鸭",
        "location": "泉州市·晋江",
        "label": "我有故事",
        "emotion": "炽烈",
        "content": `
凌晨三点，杀猪饭的摊子前，人比菜还多。
血粑鸭、咸饭、白切肉，摆满整张桌子，香气像炸弹一样炸开。
阿伯笑着把碗塞到我手里："吃！吃红，才有福气！"
那一口下去，辣到我眼泪狂飙，但整个人热血澎湃。
        `,
        "coodinates": [118.59476111423056, 24.79942127509206]
    },
    {
        "date": "2025/07/26",
        "weekday": "周六",
        "author": "风吹榕影",
        "location": "泉州市·开元寺",
        "label": "漫步灵感",
        "emotion": "安然",
        "content": `
午后阳光被榕树切成一块块，落在青石板上，像碎开的绿玉。
钟声一下一下敲，慢得像时间在打盹。
我坐在石凳上，忽然觉得，什么KPI、DDL，都离我好远好远。
        `,
        "coodinates": [118.58573450629696, 24.91425793391756]
    },
    {
        "date": "2025/07/20",
        "weekday": "周日",
        "author": "拍照踩水坑",
        "location": "厦门市·环岛南路",
        "label": "趣味发现",
        "emotion": "惊喜",
        "content": `
暴雨刚停，地上的水坑倒映整片椰子树影，像一面碎镜子。
我弯下腰拍了一张，突然踩进去，凉得一激灵😂
原来治愈感，有时候是来自一脚冰水。
        `,
        "coodinates": [118.58580960814888, 24.914170360269065]
    },
    {
        "date": "2025/07/17",
        "weekday": "周四",
        "author": "收藏路线狂魔",
        "location": "厦门市·中山路",
        "label": "实用指南",
        "emotion": "明亮",
        "content": `
今日打卡清单：
✅ 老牌花生汤（50年老店）
✅ 厦港蚵仔煎（别信点评，去巷子找没招牌的！）
✅ 甜芋泥冰（配话梅超解腻）
PS：如果逛到鞋都走烂，那你路线才走对。
        `,
        "coodinates": [117.94928238727663, 26.048080593000044]
    },
    {
        "date": "2025/07/15",
        "weekday": "周二",
        "author": "独行海边人",
        "location": "厦门市·黄厝沙滩",
        "label": "漫步灵感",
        "emotion": "低回",
        "content": `
黄昏的沙滩空空的，海浪一下一下推到脚边，又退回去。
没有音乐，没有说话声，只有海鸟偶尔叫一声，像给风签了名。
我忽然有点想家，但又舍不得离开这片安静。
        `,
        "coodinates": [118.15090697273398, 24.432876951307573]
    },
    {
        "date": "2025/07/22",
        "weekday": "周二",
        "author": "奶茶和铁观音",
        "location": "泉州市·东街口",
        "label": "生活方式",
        "emotion": "明亮",
        "content": `
泉州最魔幻的一幕：
左手奶茶，右手铁观音，坐在长凳上看小孩踢毽子。
热和冷、甜和涩、闹和静，在这条老街上融得刚刚好。
        `,
        "coodinates": [118.681766, 24.985766000000002]
    },
    {
        "date": "2025/07/12",
        "weekday": "周六",
        "author": "阴影里的石狮",
        "location": "泉州市·西街",
        "label": "文化探索",
        "emotion": "低回",
        "content": `
古街口的石狮子，青苔顺着牙齿爬下来，像披了一层绿纱。
我忍不住摸了一下，冰凉的，像时间压下来的手。
那一刻，觉得它比所有文物展板都更有故事。
        `,
        "coodinates": [118.21855291238505, 25.07637291731082]
    },
    {
        "date": "2025/07/19",
        "weekday": "周六",
        "author": "暴晒下的路牌",
        "location": "厦门市·曾厝垵",
        "label": "趣味发现",
        "emotion": "明亮",
        "content": `
中午12点，太阳像在考古，我走到巷口，看到一个路牌：
"左边海，右边心。"
忍不住拍了一张，配文：厦门的爱情观，懂了。
        `,
        "coodinates": [118.12714615794944, 24.435599287746726]
    },
    {
        "date": "2025/07/13",
        "weekday": "周日",
        "author": "三角梅撞海风",
        "location": "厦门市·沙坡尾",
        "label": "漫步灵感",
        "emotion": "温柔",
        "content": `
沙坡尾的风，吹到三角梅一片片落下，像粉色的碎信纸。
我拿起一片，放在书里，打算带回去夹进日记。
如果记忆会有香气，大概就是这一刻的咸味和花味。
        `,
        "coodinates": [118.08785311607379, 24.438387189417416]
    },
    {
        "date": "2025/07/16",
        "weekday": "周三",
        "author": "骑到海的尽头",
        "location": "厦门市·环岛路",
        "label": "我有故事",
        "emotion": "明亮",
        "content": `
环岛路一骑就是一小时，风吹得眼睛都干了。
我停在一个无名的岔口，突然看到一只白鹭贴着海面飞，
像有人在天空写了一个"自由"字。
        `,
        "coodinates": [118.1080487258618, 24.430544183642436]
    },
    {
        "date": "2025/07/25",
        "weekday": "周五",
        "author": "榕树缝里的光",
        "location": "泉州市·晋江",
        "label": "漫步灵感",
        "emotion": "安然",
        "content": `
小路两边的榕树把天遮得严严实实，
只有细细的光从缝里漏下来，打在摩托车的后视镜上，闪一下又没了。
我在树影里慢慢走，觉得世界静到连影子都在屏息。
        `,
        "coodinates": [118.64601138133268, 24.861041445400577]
    }
];

export default notesData;