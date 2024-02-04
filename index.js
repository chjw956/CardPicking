// 참고 사이트 :https://developerntraveler.tistory.com/95
// https://sisiblog.tistory.com/234 
// https://velog.io/@dev_tuktack/NodeList-to-Array
// https://ondolroom.tistory.com/127
// https://www.daleseo.com/js-timer
// https://nyol.tistory.com/166
// https://hianna.tistory.com/722

// 종료화면 구현하기!!!!!
// 화면에 겹치게 검은 화면 살짝 뜨면서 정중앙에 알림창 뜨게끔!
// container의 배경을 검은색 투명한 걸로 바꾸면서
// container와 형제 노드인 div를 만들어서 화면 정중앙에 띄우는 방법으로..!
// -> 배경 어두워지는 팝업창!! "레이어 팝업, 모달 팝업"
// https://sevendays.tistory.com/30

// 이미 뽑은 카드는 못 누르게 만들기!


// 자바스크립트에서 깊은 복사는 요소 하나하나를 모두 복사해오는 수밖에 없음

let score = 0;
let beforeCard = null;
let presentCard = null;
const picked = [];
const picking = [];
const container = document.querySelector(".container");
const replay = document.querySelector(".replay");


// 배열의 요소를 무작위로 섞는 함수
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

// DIV 객체(card)를 동적으로 생성, 삽입
function make(){
    const cardSet = document.querySelector(".cardSet");
    
    const nums = [...Array(8).fill().map((v, i) => i+1), ...Array(8).fill().map((v, i) => i+1)] 
    shuffle(nums);

    // 6, 7, 8, 11, 12, 13, 16, 17, 18
    for(let i = 1; i <= 25; i++){
        const box = document.createElement("div");
        box.setAttribute("class", "box");

        if(((i > 6) && (i <= 9)) || ((i > 11) && (i <= 14)) || ((i > 16) && (i <= 19))){
            const blank = document.createElement("div");
            const cover = document.createElement("div");

            blank.setAttribute("class", "blank");
            if (i === 13){
                cover.setAttribute("class", "scoreCover");
                cover.innerHTML = `점수<br><span class="score">${score} 점</span>`;
            }else
                cover.setAttribute("class", "cover");

            box.appendChild(blank);
            box.appendChild(cover);
        }else{
            const card = document.createElement("div");
            const clickCover = document.createElement("div");

            card.setAttribute("class", "card");
            clickCover.setAttribute("class", "clickCover");
            
            let num = nums.pop();
            card.innerText = num;
            box.appendChild(card);
            box.appendChild(clickCover);
        }
        cardSet.appendChild(box);
    }
}

function addFunction() {
    // 각 요소에 맞는 이벤트 리스너 지정
    const covers = document.querySelectorAll('.clickCover');
    // console.log(typeof covers);         // object (NodeList)
    const coversLeft = [covers[5], covers[7], covers[9]];
    const coversRight = [covers[6], covers[8], covers[10]];

    // 스프레드(...)를 사용하여  covers를 펼쳐서 복사한 것을 배열([])에 넣겠다는 의미
    [...covers].slice(0, 5).forEach((cover) => {
        cover.addEventListener('click', (e) => {
            if((e.target.classList[1] !== 'clear') && (picking.length < 2))
                e.target.previousElementSibling.classList.add("goUp");
        });
    });

    [...covers].slice(11, 16).forEach((cover) => {
        cover.addEventListener('click', (e) =>{
            if((e.target.classList[1] !== 'clear') && (picking.length < 2))
                e.target.previousElementSibling.classList.add("goDown");
        });
    });

    coversLeft.forEach((cover) => {
        cover.addEventListener('click', (e) => {
            if((e.target.classList[1] !== 'clear') && (picking.length < 2))
                e.target.previousElementSibling.classList.add("goLeft");
        });
    });

    coversRight.forEach((cover) => {
        cover.addEventListener('click', (e) => {
            if((e.target.classList[1] !== 'clear') && (picking.length < 2))
                e.target.previousElementSibling.classList.add("goRight");
        });
    });
}

function openPop(score){
    const modalPop = document.querySelector('.modal-wrap');
    const modalBg = document.querySelector('.modal-bg');
    const showScore = document.querySelector('.showScore');

    showScore.innerText = `획득 점수: ${score}점`;

    modalBg.style.display = "block";
    modalPop.style.display = "block";

    // let popup = window.open("", "endAlarm", "menubar=1 toolbar=no location=0 width=300px, height=300px, scrollbars=no");
}


// 게임 다시 시작
replay.addEventListener('click', function(e){
    score = 0;

    const cardSet = document.querySelector(".cardSet");
    cardSet.replaceChildren();

    const modalPop = document.querySelector('.modal-wrap');
    const modalBg = document.querySelector('.modal-bg');
    modalBg.style.display = "none";
    modalPop.style.display = "none";

    init();
});

// document의 클릭 이벤트를 감지하는 애가 하나
// 클릭했을 때 감지하는 애를 하나 더 추가함
// 그러면 다음 클릭 때는 클릭 이벤트가 두번 일어나고 또 감지하는애를 더 추가함
// 클릭했을 때 어떤 객체를 선택했는지 알려주는 함수
container.addEventListener('click', function(e){
    const scoreCover = document.querySelector(".scoreCover");
    if((e.target.className === 'clickCover') && (picking.length < 2)){
        if(beforeCard === null){
            beforeCard = e.target.previousElementSibling;
            picking.push(beforeCard);
        }else{
            presentCard = e.target.previousElementSibling;
            picking.push(presentCard);
            setTimeout(() => {
                if(beforeCard === presentCard){
                    alert("서로 다른 카드를 뽑아주세요!");
                }else if((presentCard !== beforeCard) && (presentCard.innerText === beforeCard.innerText)){
                    score += 15;
                    alert("잘했어요!😉 (+15점)");
                    // 뽑았던 카드가 노출되게 만들기

                    // 이벤트 리스너 삭제
                    // 이벤트 리스너로 등록된 함수의 이름을 읽어올 수 없다는 문제점
                    // 투명한 div로 덮어버리기

                    beforeCard.nextElementSibling.classList.add('clear');
                    presentCard.nextElementSibling.classList.add('clear');
                    
                    picked.push({...beforeCard}); 
                    picked.push({...presentCard});
                    
                }else if((presentCard !== beforeCard) && (presentCard.innerText !== beforeCard.innerText)){
                    score -= 10;
                    alert("다시 뽑아볼까요?🥲 (-10점)");              
                }
                beforeCard.classList.remove("goUp");
                beforeCard.classList.remove("goDown");
                beforeCard.classList.remove("goRight");
                beforeCard.classList.remove("goLeft");
                presentCard.classList.remove("goUp");
                presentCard.classList.remove("goDown");
                presentCard.classList.remove("goRight");
                presentCard.classList.remove("goLeft");

                beforeCard = null;
                presentCard = null;
                picking.splice(0, 2);

                if(picked.length === 16){
                    // 팝업창 띄우기!
                    openPop(score);
                }

                console.log(scoreCover);
                scoreCover.innerHTML = `점수<br><span class="score">${score} 점</span>`;
            }, 1000);
        }
    }
});


function init() {
    make();
    addFunction();
}



init();









