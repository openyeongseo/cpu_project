import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Search, MapPin, Heart, Star, ArrowRight, Bell, Home,
  Compass, Route, CalendarDays, BookOpen, MessageCircle,
  Filter, Bot, X, Send, Camera, Share2, Instagram, Flag,
  Users, CheckCircle, Clock, TrendingUp, Sparkles,
  ChevronRight, Bookmark, PlusCircle,
  ShoppingBag, Shirt, Palette, Cpu,
  Utensils, Tv, Smile, PawPrint, Image, LocateFixed,
  Mail, Lock, User as UserIcon, Eye, EyeOff,
  LogOut, Trash2, AlertTriangle, ShieldCheck, Check
} from "lucide-react";

type Page = "home" | "find" | "course" | "my" | "community"
  | "login" | "signup" | "findId" | "findPassword" | "detail";
type MyTab = "찜한 팝업" | "캘린더" | "예약 내역" | "다녀온 팝업" | "팝업 노트";
type CommTab = "후기" | "동행 모집";

interface UserAccount { name:string; email:string; provider:"local"|"google"; }
const MOCK_AUTH_CODE = "123456";

interface Reservation { id:number; popupId:number; slot:string; status:"예정"|"완료"; }

interface Popup {
  id: number; name: string; brand: string; location: string; area: string;
  category: string; startDate: string; endDate: string; imgId: string;
  likes: number; reviews: number;
  reservationType: "사전 예약" | "선착순" | "무료 입장";
  isHot: boolean; congestion: "여유" | "보통" | "혼잡" | "매우 혼잡";
  description: string; bestTime: string;
}

const ALL_POPUPS: Popup[] = [
  { id:1, name:"NewJeans × Musinsa", brand:"무신사", location:"성수이로 78, 성동구", area:"성수", category:"패션",
    startDate:"07.01", endDate:"07.14", imgId:"1558618666-fcd25c85cd64",
    likes:2847, reviews:412, reservationType:"사전 예약", isHot:true, congestion:"매우 혼잡",
    description:"NewJeans × 무신사 단독 콜라보. 한정판 굿즈 & 포토부스.", bestTime:"평일 오전 10–11시" },
  { id:2, name:"Gentle Monster DREAM FACTORY", brand:"젠틀몬스터", location:"와우산로 35, 마포구", area:"홍대", category:"패션",
    startDate:"07.05", endDate:"07.20", imgId:"1441986300917-64674bd600d8",
    likes:1923, reviews:287, reservationType:"무료 입장", isHot:true, congestion:"혼잡",
    description:"드림 팩토리 컨셉 아이웨어 팝업. 몰입형 공간 체험.", bestTime:"평일 오후 2–4시" },
  { id:3, name:"Nike Jordan Brand Seoul", brand:"나이키", location:"올림픽로 300, 송파구", area:"잠실", category:"스포츠",
    startDate:"07.01", endDate:"07.07", imgId:"1542291026-7eec264c27ff",
    likes:3201, reviews:589, reservationType:"선착순", isHot:true, congestion:"매우 혼잡",
    description:"조던 40주년 기념 팝업. 레어 스니커즈 전시 & 한정판 발매.", bestTime:"평일 오전 9–10시" },
  { id:4, name:"LOEWE Craft Prize 2025", brand:"로에베", location:"압구정로 454, 강남구", area:"청담", category:"아트",
    startDate:"06.28", endDate:"07.13", imgId:"1518998053901-5348d3961a04",
    likes:892, reviews:134, reservationType:"무료 입장", isHot:false, congestion:"여유",
    description:"로에베 재단 크래프트 프라이즈 수상작 전시.", bestTime:"언제든 여유로워요" },
  { id:5, name:"aespa × Adobe 'AI WORLD'", brand:"어도비", location:"테헤란로 521, 강남구", area:"강남", category:"테크",
    startDate:"07.10", endDate:"07.20", imgId:"1518770660439-4636190af475",
    likes:1567, reviews:203, reservationType:"사전 예약", isHot:true, congestion:"보통",
    description:"에스파 × 어도비 AI 아트 인터랙티브 체험 팝업.", bestTime:"평일 오후 4–6시" },
  { id:6, name:"Arc'teryx Seoul Studio", brand:"아크테릭스", location:"이태원로 240, 용산구", area:"한남", category:"아웃도어",
    startDate:"07.08", endDate:"07.21", imgId:"1551698618-1dfe5d97d256",
    likes:743, reviews:98, reservationType:"무료 입장", isHot:false, congestion:"여유",
    description:"시즌 신상품 체험 팝업. 실내 클라이밍 시뮬레이터 운영.", bestTime:"언제든 여유로워요" },
  { id:7, name:"MARDI MERCREDI 홍대", brand:"마르디 메크르디", location:"어울마당로 35, 마포구", area:"홍대", category:"패션",
    startDate:"07.05", endDate:"07.15", imgId:"1469334031218-e382a71b716b",
    likes:1204, reviews:176, reservationType:"무료 입장", isHot:false, congestion:"보통",
    description:"플라워 프린트 신규 컬렉션 선공개 팝업.", bestTime:"평일 오후 1–3시" },
  { id:8, name:"Porsche 'Dream Big' 팝업", brand:"포르쉐", location:"영동대로 513, 강남구", area:"강남", category:"라이프",
    startDate:"07.12", endDate:"07.27", imgId:"1503376780353-7e6692767b70",
    likes:987, reviews:145, reservationType:"사전 예약", isHot:false, congestion:"여유",
    description:"신형 911 관람 및 VR 시승 체험 팝업.", bestTime:"주말 오후 2–4시" },
  { id:9, name:"스타벅스 서머 프라페 랩", brand:"스타벅스", location:"올림픽로 240, 송파구", area:"잠실", category:"푸드",
    startDate:"07.03", endDate:"07.16", imgId:"1555396273-367ea4eb4db5",
    likes:1342, reviews:210, reservationType:"무료 입장", isHot:true, congestion:"보통",
    description:"여름 한정 프라페 시음 & 커스텀 굿즈 제작 팝업.", bestTime:"평일 오전 11–12시" },
  { id:10, name:"설빙 × 산리오 빙수 팝업", brand:"설빙", location:"양화로 175, 마포구", area:"홍대", category:"푸드",
    startDate:"07.08", endDate:"07.22", imgId:"1517686469429-8bdb88b9f907",
    likes:876, reviews:120, reservationType:"선착순", isHot:false, congestion:"여유",
    description:"산리오 캐릭터 콜라보 빙수 & 포토존 운영.", bestTime:"평일 오후 3–5시" },
  { id:11, name:"이니스프리 그린카페 팝업", brand:"이니스프리", location:"성수이로 12, 성동구", area:"성수", category:"라이프",
    startDate:"07.02", endDate:"07.15", imgId:"1499955085172-a104c9463ece",
    likes:654, reviews:88, reservationType:"무료 입장", isHot:false, congestion:"여유",
    description:"제주 원료 뷰티 체험 & 그린카페 시음존.", bestTime:"언제든 여유로워요" },
  { id:12, name:"샤넬 뷰티 팝업 스튜디오", brand:"샤넬", location:"압구정로 60길, 강남구", area:"청담", category:"패션",
    startDate:"07.06", endDate:"07.20", imgId:"1445205170230-053b83016050",
    likes:2103, reviews:301, reservationType:"사전 예약", isHot:true, congestion:"혼잡",
    description:"샤넬 신상 컬렉션 프라이빗 쇼룸 & 메이크업 체험.", bestTime:"평일 오전 11시" },
  { id:13, name:"우영미 쇼룸 팝업", brand:"우영미", location:"이태원로 268, 용산구", area:"한남", category:"패션",
    startDate:"07.09", endDate:"07.23", imgId:"1441984904996-e0b6ba687e04",
    likes:543, reviews:76, reservationType:"무료 입장", isHot:false, congestion:"여유",
    description:"25FW 프리컬렉션 쇼룸 공개 팝업.", bestTime:"평일 오후 2–4시" },
  { id:14, name:"삼성 갤럭시 언팩 체험존", brand:"삼성전자", location:"테헤란로 129, 강남구", area:"강남", category:"테크",
    startDate:"07.11", endDate:"07.25", imgId:"1519389950473-47ba0277781c",
    likes:1890, reviews:245, reservationType:"사전 예약", isHot:true, congestion:"혼잡",
    description:"신제품 갤럭시 언팩 라인업 체험 & 사전예약 혜택존.", bestTime:"평일 오전 10시" },
  { id:15, name:"LG 올레드 아트관", brand:"LG전자", location:"올림픽로 240, 송파구", area:"잠실", category:"테크",
    startDate:"07.04", endDate:"07.18", imgId:"1550745165-9bc0b252726f",
    likes:721, reviews:99, reservationType:"무료 입장", isHot:false, congestion:"보통",
    description:"올레드 디스플레이로 즐기는 미디어 아트 전시.", bestTime:"평일 오후 1–3시" },
  { id:16, name:"국립현대미술관 팝업展", brand:"국립현대미술관", location:"압구정로 458, 강남구", area:"청담", category:"아트",
    startDate:"06.30", endDate:"07.20", imgId:"1531058020387-3be344556be6",
    likes:432, reviews:65, reservationType:"무료 입장", isHot:false, congestion:"여유",
    description:"현대 미술 소장품 특별 순회 전시.", bestTime:"언제든 여유로워요" },
  { id:17, name:"이건용 회고전 팝업", brand:"갤러리현대", location:"이태원로 240, 용산구", area:"한남", category:"아트",
    startDate:"07.07", endDate:"07.28", imgId:"1460661419201-fd4cecdf8a8b",
    likes:389, reviews:54, reservationType:"무료 입장", isHot:false, congestion:"여유",
    description:"한국 실험미술 거장의 회고전 팝업 갤러리.", bestTime:"평일 오후 3시" },
  { id:18, name:"아디다스 삼바 팝업 스토어", brand:"아디다스", location:"성수이로 20, 성동구", area:"성수", category:"스포츠",
    startDate:"07.03", endDate:"07.13", imgId:"1517649763962-0c623066013b",
    likes:2560, reviews:410, reservationType:"선착순", isHot:true, congestion:"매우 혼잡",
    description:"삼바 한정판 컬러웨이 최초 공개 & 커스터마이징존.", bestTime:"평일 오전 9–10시" },
  { id:19, name:"룰루레몬 웰니스 스튜디오", brand:"룰루레몬", location:"올림픽로 300, 송파구", area:"잠실", category:"스포츠",
    startDate:"07.10", endDate:"07.24", imgId:"1595950653106-6c9ebd614d3a",
    likes:678, reviews:91, reservationType:"무료 입장", isHot:false, congestion:"보통",
    description:"무료 요가·필라테스 클래스 체험 팝업.", bestTime:"평일 오전 7–8시" },
  { id:20, name:"노스페이스 서밋 팝업", brand:"노스페이스", location:"이태원로 220, 용산구", area:"한남", category:"아웃도어",
    startDate:"07.05", endDate:"07.19", imgId:"1504280390367-361c6d9f38f4",
    likes:812, reviews:112, reservationType:"무료 입장", isHot:false, congestion:"여유",
    description:"고어텍스 신제품 체험 & 실내 클라이밍 월.", bestTime:"언제든 여유로워요" },
  { id:21, name:"코오롱스포츠 캠핑 팝업", brand:"코오롱스포츠", location:"올림픽로 250, 송파구", area:"잠실", category:"아웃도어",
    startDate:"07.12", endDate:"07.26", imgId:"1481277542470-605612bd2d61",
    likes:456, reviews:63, reservationType:"선착순", isHot:false, congestion:"보통",
    description:"캠핑 장비 체험 & 백패킹 클래스 운영.", bestTime:"주말 오전 11시" },
  { id:22, name:"무인양품 라이프 스튜디오", brand:"무인양품", location:"양화로 160, 마포구", area:"홍대", category:"라이프",
    startDate:"07.02", endDate:"07.16", imgId:"1493663284031-b7e3aefcae8e",
    likes:934, reviews:128, reservationType:"무료 입장", isHot:false, congestion:"보통",
    description:"미니멀 라이프 큐레이션 & 리퍼브 굿즈 코너.", bestTime:"평일 오후 4시" },
  { id:23, name:"다이슨 테크 체험관", brand:"다이슨", location:"압구정로 442, 강남구", area:"청담", category:"테크",
    startDate:"07.14", endDate:"07.28", imgId:"1522708323590-d24dbb6b0267",
    likes:1123, reviews:156, reservationType:"사전 예약", isHot:true, congestion:"혼잡",
    description:"신제품 헤어케어·공기청정 라인업 1:1 체험.", bestTime:"평일 오전 11시" },
  { id:24, name:"곰표 밀맥주 여름 축제", brand:"곰표", location:"성수이로 5, 성동구", area:"성수", category:"푸드",
    startDate:"07.01", endDate:"07.10", imgId:"1587440871875-191322ee64b0",
    likes:1567, reviews:230, reservationType:"선착순", isHot:true, congestion:"매우 혼잡",
    description:"곰표 밀맥주 시음 & 레트로 굿즈 팝업 마켓.", bestTime:"평일 오후 5–6시" },
];

const CONG: Record<string,{color:string;bg:string}> = {
  "여유":    {color:"#10B981", bg:"#ECFDF5"},
  "보통":    {color:"#F59E0B", bg:"#FFFBEB"},
  "혼잡":    {color:"#F97316", bg:"#FFF7ED"},
  "매우 혼잡":{color:"#EF4444", bg:"#FEF2F2"},
};
const RES: Record<string,{color:string;bg:string}> = {
  "사전 예약":{color:"#2263EC", bg:"#E8F1FF"},
  "선착순":  {color:"#F97316", bg:"#FFF7ED"},
  "무료 입장":{color:"#10B981", bg:"#ECFDF5"},
};

function imgUrl(id:string, w=600, h=400){ return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`; }

/* 3D 아이콘 */
function Icon3D({ children, gradient, size=48 }:{ children:React.ReactNode; gradient:string; size?:number }) {
  return (
    <div className="flex items-center justify-center flex-shrink-0"
      style={{width:size,height:size,borderRadius:size*0.2,background:gradient,
        boxShadow:"0 4px 14px rgba(34,99,236,0.18),0 1px 0 rgba(255,255,255,0.7) inset,0 -1px 0 rgba(0,0,0,0.06) inset",
        border:"1px solid rgba(255,255,255,0.6)"}}>
      {children}
    </div>
  );
}

function CongestionBadge({ level }:{ level:string }) {
  const c = CONG[level];
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{color:c.color,backgroundColor:c.bg}}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor:c.color}} />{level}
    </span>
  );
}
function ResBadge({ type }:{ type:string }) {
  const s = RES[type];
  return <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full" style={{color:s.color,backgroundColor:s.bg}}>{type}</span>;
}

function PopupCard({ p, liked, onToggleLike, onOpenDetail }:{ p:Popup; liked:boolean; onToggleLike:(id:number)=>void; onOpenDetail:(id:number)=>void }) {
  return (
    <motion.div whileHover={{y:-5}} transition={{duration:0.22}} onClick={()=>onOpenDetail(p.id)}
      className="rounded-xl overflow-hidden bg-white flex flex-col cursor-pointer"
      style={{boxShadow:"0 2px 16px rgba(34,99,236,0.08)",border:"1px solid rgba(34,99,236,0.09)"}}>
      <div className="relative" style={{height:190}}>
        <img src={imgUrl(p.imgId,600,380)} alt={p.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {p.isHot && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-white text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{background:"#2263EC",boxShadow:"0 2px 8px rgba(34,99,236,0.4)"}}>
            <TrendingUp size={10}/> HOT
          </div>
        )}
        <button onClick={(e)=>{e.stopPropagation();onToggleLike(p.id);}}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center"
          style={{background:"rgba(255,255,255,0.88)",backdropFilter:"blur(8px)",boxShadow:"0 2px 8px rgba(0,0,0,0.12)"}}>
          <Heart size={14} fill={liked?"#EF4444":"none"} color={liked?"#EF4444":"#6B7A99"} />
        </button>
      </div>
      <div className="p-3.5 flex flex-col gap-2">
        <div>
          <p className="text-[11px] text-[#6B7A99] font-medium mb-0.5">{p.brand}</p>
          <h3 className="text-[13px] font-bold text-[#0A1628] leading-snug">{p.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-[#6B7A99]">
          <MapPin size={11}/><span className="text-[11px]">{p.area} · {p.startDate}–{p.endDate}</span>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t" style={{borderColor:"rgba(34,99,236,0.07)"}}>
          <CongestionBadge level={p.congestion}/><ResBadge type={p.reservationType}/>
        </div>
        <div className="flex items-center gap-3 text-[#6B7A99]">
          <span className="text-[11px] flex items-center gap-1"><Heart size={10} fill="#EF4444" color="#EF4444"/> {p.likes.toLocaleString()}</span>
          <span className="text-[11px] flex items-center gap-1"><MessageCircle size={10}/> {p.reviews}</span>
          <span className="text-[11px] flex items-center gap-1 ml-auto text-[#2263EC] font-medium"><Clock size={10}/> {p.bestTime}</span>
        </div>
      </div>
    </motion.div>
  );
}

function PreOrderCard({ p, dday, liked, onToggleLike, onOpenDetail }:{ p:Popup; dday:number; liked:boolean; onToggleLike:(id:number)=>void; onOpenDetail:(id:number)=>void }) {
  return (
    <button onClick={()=>onOpenDetail(p.id)} className="flex-shrink-0 text-left" style={{width:200}}>
      <div className="relative rounded-xl overflow-hidden" style={{height:140}}>
        <img src={imgUrl(p.imgId,400,280)} alt={p.name} className="w-full h-full object-cover"/>
        <span className="absolute top-2.5 left-2.5 text-[11px] font-bold text-white px-2.5 py-1 rounded-full" style={{background:"#F97316"}}>
          사전예약 {dday>0?`D-${dday}`:"OPEN"}
        </span>
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2"
          style={{background:"linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0.55) 100%)"}}>
          <span className="text-white text-[11px] font-semibold flex items-center gap-1"><Bell size={11}/> 찜하고 알림받기</span>
          <button onClick={(e)=>{e.stopPropagation();onToggleLike(p.id);}} className="flex-shrink-0">
            <Heart size={15} fill={liked?"#EF4444":"none"} color="#fff"/>
          </button>
        </div>
      </div>
      <p className="font-bold text-sm text-[#0A1628] mt-2.5 truncate">{p.name}</p>
      <p className="text-xs text-[#6B7A99] mt-1">{p.startDate} – {p.endDate}</p>
      <div className="flex gap-1.5 mt-2">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{background:"#F0F4FF",color:"#6B7A99"}}>{p.area}</span>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{background:"#F0F4FF",color:"#6B7A99"}}>{p.category}</span>
      </div>
    </button>
  );
}

function RankingCard({ rank, p, liked, onToggleLike, onOpenDetail }:{ rank:number; p:Popup; liked:boolean; onToggleLike:(id:number)=>void; onOpenDetail:(id:number)=>void }) {
  return (
    <motion.div whileHover={{y:-4}} onClick={()=>onOpenDetail(p.id)} className="relative cursor-pointer">
      <div className="relative rounded-xl overflow-hidden" style={{height:170}}>
        <img src={imgUrl(p.imgId,400,320)} alt={p.name} className="w-full h-full object-cover"/>
        <button onClick={(e)=>{e.stopPropagation();onToggleLike(p.id);}}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center"
          style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(6px)"}}>
          <Heart size={14} fill={liked?"#EF4444":"none"} color={liked?"#EF4444":"#6B7A99"}/>
        </button>
        <span className="absolute z-10 select-none pointer-events-none font-extrabold"
          style={{left:6,bottom:2,fontSize:52,lineHeight:1,color:"#fff",WebkitTextStroke:"1.5px rgba(10,22,40,0.15)",textShadow:"0 4px 16px rgba(0,0,0,0.35)"}}>
          {rank}
        </span>
      </div>
      <div className="pt-3 pl-1">
        <p className="font-bold text-sm text-[#0A1628] truncate">{p.name}</p>
        <p className="text-xs text-[#6B7A99] mt-1">{p.startDate} – {p.endDate}</p>
        <div className="flex gap-1.5 mt-2">
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{background:"#F0F4FF",color:"#6B7A99"}}>{p.area}</span>
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{background:"#F0F4FF",color:"#6B7A99"}}>{p.category}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══ HOME ═══ */
const CONGESTION_HOURS=[{t:"10시",v:20},{t:"11시",v:38},{t:"12시",v:88},{t:"13시",v:100},{t:"14시",v:78},
  {t:"15시",v:65},{t:"16시",v:50},{t:"17시",v:82},{t:"18시",v:95},{t:"19시",v:72},{t:"20시",v:40},{t:"21시",v:18}];

const BANNER_SLIDES = ALL_POPUPS.map(p=>({ id:p.id, imgId:p.imgId, name:p.name, date:`${p.startDate} - ${p.endDate}`, area:p.area, tagline:p.description }));

function MonthlyBanner({ onOpenDetail }:{ onOpenDetail:(id:number)=>void }) {
  const [idx,setIdx]=useState(0);
  const n=BANNER_SLIDES.length;

  useEffect(()=>{
    const t=setInterval(()=>setIdx(i=>(i+1)%n),4000);
    return ()=>clearInterval(t);
  },[n]);

  function go(i:number){ setIdx(((i%n)+n)%n); }

  return (
    <div className="mt-6 select-none">
      <div className="relative flex items-center justify-center overflow-hidden" style={{height:400}}>
        {[-1,0,1].map(d=>{
          const i=((idx+d)%n+n)%n;
          const s=BANNER_SLIDES[i];
          const isActive=d===0;
          return (
            <motion.button key={i} onClick={()=>isActive?onOpenDetail(s.id):go(i)}
              animate={{ x:d*310, scale:isActive?1:0.8, opacity:isActive?1:0.4, filter:isActive?"blur(0px)":"blur(1.5px)", zIndex:isActive?10:1 }}
              transition={{duration:0.5,ease:"easeOut"}}
              className="absolute rounded-2xl overflow-hidden cursor-pointer"
              style={{width:isActive?560:420,height:isActive?372:278}}>
              <img src={imgUrl(s.imgId,1100,700)} alt={s.name} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"/>
              {isActive&&(
                <>
                  <span className="absolute top-4 left-4 flex items-center gap-1.5 text-white text-sm font-bold px-3.5 py-1.5 rounded-full"
                    style={{background:"rgba(34,99,236,0.9)",backdropFilter:"blur(6px)"}}>
                    🔥 이 달의 찰리 Pick
                  </span>
                  <span className="absolute top-4 right-4 text-white text-sm font-bold px-2.5 py-1.5 rounded-full" style={{background:"rgba(0,0,0,0.35)"}}>
                    {idx+1}/{n}
                  </span>
                  <div className="absolute bottom-5 left-6 right-6">
                    <p className="text-white/70 text-sm mb-1.5">{s.date} · {s.area}</p>
                    <p className="text-white font-extrabold text-2xl leading-snug">{s.name}</p>
                  </div>
                </>
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {BANNER_SLIDES.map((_,i)=>(
          <button key={i} onClick={()=>go(i)} className="rounded-full transition-all"
            style={i===idx?{width:16,height:6,background:"#2263EC"}:{width:6,height:6,background:"rgba(34,99,236,0.25)"}}/>
        ))}
      </div>
    </div>
  );
}

const CATEGORIES=[
  {label:"F&B",       icon:<Utensils size={19}/>,  bg:"#FFF1E6", color:"#EA580C"},
  {label:"뷰티",       icon:<Sparkles size={19}/>,  bg:"#FDE8F3", color:"#DB2777"},
  {label:"패션",       icon:<Shirt size={19}/>,     bg:"#EAF1FF", color:"#2563EB"},
  {label:"엔터테인먼트",icon:<Tv size={19}/>,        bg:"#F3EAFE", color:"#9333EA"},
  {label:"애니/캐릭터", icon:<Smile size={19}/>,     bg:"#FFF9E0", color:"#CA8A04"},
  {label:"문구/아트",   icon:<Palette size={19}/>,   bg:"#E7FBF3", color:"#059669"},
  {label:"연예인/셀럽", icon:<Star size={19}/>,      bg:"#FFEAEE", color:"#E11D48"},
  {label:"키즈/반려동물",icon:<PawPrint size={19}/>, bg:"#E6FBF8", color:"#0D9488"},
  {label:"라이프스타일", icon:<Image size={19}/>,    bg:"#F0F4FF", color:"#6366F1"},
  {label:"디지털/테크",  icon:<Cpu size={19}/>,      bg:"#EFF6FF", color:"#0EA5E9"},
];

function CategoryChip({ label, icon, bg, color, onClick }:{
  label:string; icon:React.ReactNode; bg:string; color:string; onClick:()=>void;
}) {
  return (
    <motion.button whileTap={{scale:0.92}} onClick={onClick} className="flex flex-col items-center gap-2 group flex-shrink-0" style={{width:60}}>
      <div className="w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5"
        style={{background:bg}}>
        <span style={{color}} className="flex items-center justify-center">{icon}</span>
      </div>
      <span className="text-[11px] font-semibold text-[#6B7A99] group-hover:text-[#0A1628] transition-colors">{label}</span>
    </motion.button>
  );
}

function HomePage({ liked, onToggleLike, onOpenDetail, onSelectCategory, reservations, onReserve }:{
  liked:Set<number>; onToggleLike:(id:number)=>void; onOpenDetail:(id:number)=>void; onSelectCategory:(category:string)=>void;
  reservations:Reservation[]; onReserve:(popupId:number,slot:string)=>void;
}) {
  const [hotExpanded,setHotExpanded]=useState(false);
  const hotAll = ALL_POPUPS.filter(p=>p.isHot);
  const hot = hotExpanded ? hotAll : hotAll.slice(0,4);
  const [rankArea,setRankArea]=useState("전체");
  const [rankExpanded,setRankExpanded]=useState(false);
  const rankedAll = ALL_POPUPS
    .filter(p=>rankArea==="전체"||p.area===rankArea)
    .slice().sort((a,b)=>b.likes-a.likes)
    .slice(0,8);
  const ranked = rankExpanded ? rankedAll : rankedAll.slice(0,4);

  const today=5;
  const preOrderPopups = ALL_POPUPS
    .filter(p=>p.reservationType==="사전 예약")
    .map(p=>({p,dday:dayOfMonth(p.startDate)-today}))
    .sort((a,b)=>a.dday-b.dday);
  const upcomingPreOrders = preOrderPopups.filter(x=>x.dday>0);
  const nowReservable = preOrderPopups.filter(x=>x.dday<=0 && dayOfMonth(x.p.endDate)>=today).map(x=>x.p);

  const [query,setQuery]=useState("");
  const q=query.trim().toLowerCase();
  const searchResults = q ? ALL_POPUPS.filter(p=>
    p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.area.includes(q)||p.category.includes(q)
  ) : [];

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{background:"linear-gradient(160deg,#EBF2FF 0%,#F7F9FF 55%,#FFFFFF 100%)"}}>
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-30" style={{background:"radial-gradient(circle,#2263EC 0%,transparent 70%)"}}/>
        <div className="absolute top-24 -left-20 w-72 h-72 rounded-full opacity-15" style={{background:"radial-gradient(circle,#2263EC 0%,transparent 70%)"}}/>
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-10">
          <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
            <h1 className="text-[52px] font-extrabold leading-[1.35] tracking-tight text-[#0A1628] mb-3"
              style={{letterSpacing:"-0.03em"}}>
              당신만을 위한,<br/><span style={{color:"#2263EC"}}>팝업</span>을 발견하세요
            </h1>
            <p className="text-[#6B7A99] text-base mb-7">AI가 당신의 취향으로 큐레이션한 팝업 코스</p>
            <div className="relative max-w-xl">
              <div className="flex items-center gap-2"
                style={{background:"#FFFFFF",border:"1.5px solid rgba(34,99,236,0.15)",borderRadius:12,boxShadow:"0 4px 24px rgba(34,99,236,0.10)"}}>
                <Search size={17} color="#2263EC" className="ml-4 flex-shrink-0"/>
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="팝업 이름, 브랜드, 지역 검색..."
                  className="bg-transparent flex-1 outline-none text-sm text-[#0A1628] placeholder-[#6B7A99] py-3.5"/>
                {query&&(
                  <button onClick={()=>setQuery("")} className="mr-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"#F0F4FF"}}>
                    <X size={12} color="#6B7A99"/>
                  </button>
                )}
                <button className="m-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-bold flex-shrink-0"
                  style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:"0 4px 12px rgba(34,99,236,0.35)"}}>
                  검색
                </button>
              </div>
              {query&&(
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden z-30"
                  style={{background:"#fff",border:"1px solid rgba(34,99,236,0.1)",boxShadow:"0 16px 48px rgba(34,99,236,0.15)",maxHeight:360,overflowY:"auto"}}>
                  {searchResults.length>0?(
                    searchResults.slice(0,6).map(p=>(
                      <button key={p.id} onClick={()=>{onOpenDetail(p.id);setQuery("");}}
                        className="flex items-center gap-3 w-full px-4 py-3 text-left" style={{borderBottom:"1px solid rgba(34,99,236,0.06)"}}>
                        <img src={imgUrl(p.imgId,80,80)} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0"/>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#0A1628] truncate">{p.name}</p>
                          <p className="text-xs text-[#6B7A99]">{p.brand} · {p.area}</p>
                        </div>
                        <CongestionBadge level={p.congestion}/>
                      </button>
                    ))
                  ):(
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm text-[#6B7A99]">'{query}'에 대한 검색 결과가 없어요</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
          <MonthlyBanner onOpenDetail={onOpenDetail}/>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* 카테고리 */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-[#0A1628] mb-4">카테고리</h2>
          <div className="grid grid-cols-5 gap-2 justify-items-center">
            {CATEGORIES.map(cat=>
              <CategoryChip key={cat.label} label={cat.label} icon={cat.icon} bg={cat.bg} color={cat.color}
                onClick={()=>onSelectCategory(cat.label)}/>
            )}
          </div>
        </div>

        {/* HOT */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#0A1628] flex items-center gap-2">
              이번 주 <span style={{color:"#2263EC"}}>HOT</span> <span className="text-sm text-[#6B7A99] font-normal">팝업</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {hot.map(p=><PopupCard key={p.id} p={p} liked={liked.has(p.id)} onToggleLike={onToggleLike} onOpenDetail={onOpenDetail}/>)}
          </div>
          {hotAll.length>4&&(
            <button onClick={()=>setHotExpanded(v=>!v)}
              className="w-full mt-6 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
              style={{background:"#fff",color:"#2263EC",border:"1.5px solid rgba(34,99,236,0.15)"}}>
              {hotExpanded?"접기":"더보기"}
              <ChevronRight size={14} style={{transform:hotExpanded?"rotate(-90deg)":"rotate(90deg)"}}/>
            </button>
          )}
        </div>

        {/* 실시간 인기 급상승 랭킹 */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-[#0A1628] mb-4">실시간 인기 <span style={{color:"#2263EC"}}>급상승</span> 랭킹</h2>
          <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
            {AREAS.map(a=>(
              <button key={a} onClick={()=>{setRankArea(a);setRankExpanded(false);}}
                className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0"
                style={rankArea===a?{background:"#0A1628",color:"#fff"}:{background:"#fff",color:"#6B7A99",border:"1px solid rgba(10,22,40,0.1)"}}>
                {a}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
            {ranked.map((p,i)=>(
              <RankingCard key={p.id} rank={i+1} p={p} liked={liked.has(p.id)} onToggleLike={onToggleLike} onOpenDetail={onOpenDetail}/>
            ))}
          </div>
          {rankedAll.length===0&&(
            <p className="text-center text-sm text-[#6B7A99] py-8">이 지역엔 랭킹에 오른 팝업이 없어요</p>
          )}
          {rankedAll.length>4&&(
            <button onClick={()=>setRankExpanded(v=>!v)}
              className="w-full mt-7 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
              style={{background:"#fff",color:"#2263EC",border:"1.5px solid rgba(34,99,236,0.15)"}}>
              {rankExpanded?"접기":"더보기"}
              <ChevronRight size={14} style={{transform:rankExpanded?"rotate(-90deg)":"rotate(90deg)"}}/>
            </button>
          )}
        </div>

        {/* 사전예약 오픈 알림 */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[#0A1628]">찜하고 사전예약 <span style={{color:"#2263EC"}}>오픈 알림받기</span></h2>
            <button className="text-[#2263EC] text-xs font-bold flex items-center gap-1">더보기 <ArrowRight size={13}/></button>
          </div>
          {upcomingPreOrders.length>0?(
            <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
              {upcomingPreOrders.map(({p,dday})=>
                <PreOrderCard key={p.id} p={p} dday={dday} liked={liked.has(p.id)} onToggleLike={onToggleLike} onOpenDetail={onOpenDetail}/>
              )}
            </div>
          ):(
            <p className="text-sm text-[#6B7A99] py-6 text-center">사전예약 예정인 팝업이 없어요</p>
          )}
        </div>

        {/* 지금 예약 가능한 팝업 */}
        {nowReservable.length>0&&(
          <div className="mt-10">
            <h2 className="text-lg font-bold text-[#0A1628] mb-5">지금 <span style={{color:"#2263EC"}}>예약</span> 가능한 팝업</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {nowReservable.map(p=>
                <ReservationCard key={p.id} p={p} reservation={reservations.find(r=>r.popupId===p.id)} onReserve={onReserve}/>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ FIND ═══ */
const AREAS=["전체","성수","홍대","강남","청담","한남","잠실"];
const CATS=["전체","패션","아트","테크","푸드","스포츠","아웃도어","라이프"];

/* 찾기 탭 필터 — 크롤링 대상 사이트와 동일한 지역/카테고리/운영상태 체계 */
const FIND_AREAS=["성수","여의도","잠실","홍대/신촌","강남/서초","용산","서울 전체","경기/인천","경상권","충청권","전라권","강원권","제주권","전국"];
const FIND_CATEGORIES=["F&B","뷰티","패션","엔터테인먼트","애니/캐릭터","문구/아트","연예인/셀럽","키즈/반려동물","라이프스타일","디지털/테크","기타"];
const FIND_STATUS=["운영 중","오픈 예정","종료"] as const;

const FIND_AREA_MAP:Record<string,string>={"성수":"성수","홍대":"홍대/신촌","강남":"강남/서초","청담":"강남/서초","한남":"용산","잠실":"잠실"};
const FIND_CATEGORY_MAP:Record<string,string>={"패션":"패션","아트":"문구/아트","테크":"디지털/테크","푸드":"F&B","스포츠":"기타","아웃도어":"기타","라이프":"라이프스타일"};
function toFindArea(area:string){ return FIND_AREA_MAP[area]||area; }
function toFindCategory(category:string){ return FIND_CATEGORY_MAP[category]||category; }
function toFindStatus(status:string){ return status==="오픈예정"?"오픈 예정":status==="종료"?"종료":"운영 중"; }

function FindPage({ liked, onToggleLike, onOpenDetail, initialCategory }:{
  liked:Set<number>; onToggleLike:(id:number)=>void; onOpenDetail:(id:number)=>void; initialCategory?:string|null;
}) {
  const [query,setQuery]=useState("");
  const [selCat,setSelCat]=useState<string|null>(initialCategory?toFindCategory(initialCategory):null);
  const [selArea,setSelArea]=useState<string|null>(null);
  const [selStatus,setSelStatus]=useState<Set<string>>(new Set(["운영 중","오픈 예정"]));
  const [showFilter,setShowFilter]=useState(!!initialCategory);

  function toggleStatus(s:string){
    setSelStatus(prev=>{
      const next=new Set(prev);
      next.has(s)?next.delete(s):next.add(s);
      return next;
    });
  }

  const filtered=ALL_POPUPS.filter(p=>{
    const q=query.toLowerCase();
    const findArea=toFindArea(p.area);
    const findCat=toFindCategory(p.category);
    const findStatus=toFindStatus(popupStatusOnDay(p,5));
    const matchQuery=!q||p.name.toLowerCase().includes(q)||p.brand.includes(q)||p.area.includes(q);
    const matchArea=!selArea||selArea==="전국"||selArea==="서울 전체"||findArea===selArea;
    const matchCat=!selCat||findCat===selCat;
    const matchStatus=selStatus.size===0||selStatus.has(findStatus);
    return matchQuery&&matchArea&&matchCat&&matchStatus;
  });
  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
      <h1 className="text-3xl font-extrabold text-[#0A1628] mb-6">팝업 <span style={{color:"#2263EC"}}>찾기</span></h1>
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3.5"
          style={{border:"1.5px solid rgba(34,99,236,0.15)",boxShadow:"0 2px 12px rgba(34,99,236,0.06)"}}>
          <Search size={16} color="#2263EC"/>
          <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="브랜드, 팝업명, 지역 검색..."
            className="bg-transparent flex-1 outline-none text-sm text-[#0A1628] placeholder-[#6B7A99]"/>
        </div>
        <button onClick={()=>setShowFilter(!showFilter)}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold transition-all"
          style={showFilter?{background:"#2263EC",color:"#fff",boxShadow:"0 4px 12px rgba(34,99,236,0.35)"}:{background:"#fff",color:"#2263EC",border:"1.5px solid rgba(34,99,236,0.2)"}}>
          <Filter size={15}/> 필터
        </button>
      </div>
      {showFilter&&(
        <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
          className="mb-4 p-5 bg-white rounded-xl"
          style={{border:"1.5px solid rgba(34,99,236,0.1)",boxShadow:"0 4px 20px rgba(34,99,236,0.06)"}}>
          <div className="mb-4">
            <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide mb-2">지역</p>
            <div className="flex flex-wrap gap-2">
              {FIND_AREAS.map(a=>(
                <button key={a} onClick={()=>setSelArea(prev=>prev===a?null:a)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={selArea===a?{background:"#2263EC",color:"#fff",boxShadow:"0 2px 8px rgba(34,99,236,0.3)"}:{background:"#E8F1FF",color:"#2263EC"}}>{a}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide mb-2">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {FIND_CATEGORIES.map(c=>(
                <button key={c} onClick={()=>setSelCat(prev=>prev===c?null:c)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={selCat===c?{background:"#2263EC",color:"#fff",boxShadow:"0 2px 8px rgba(34,99,236,0.3)"}:{background:"#E8F1FF",color:"#2263EC"}}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide mb-2">운영 상태</p>
            <div className="flex flex-wrap gap-2">
              {FIND_STATUS.map(s=>(
                <button key={s} onClick={()=>toggleStatus(s)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={selStatus.has(s)?{background:"#2263EC",color:"#fff",boxShadow:"0 2px 8px rgba(34,99,236,0.3)"}:{background:"#E8F1FF",color:"#2263EC"}}>{s}</button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      <p className="text-sm text-[#6B7A99] mb-5 font-medium"><span className="text-[#2263EC] font-bold">{filtered.length}개</span>의 팝업을 찾았어요</p>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {filtered.map(p=><PopupCard key={p.id} p={p} liked={liked.has(p.id)} onToggleLike={onToggleLike} onOpenDetail={onOpenDetail}/>)}
        {filtered.length===0&&(
          <div className="col-span-full text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{background:"#E8F1FF"}}>
              <Search size={28} color="#2263EC"/>
            </div>
            <p className="text-[#6B7A99] font-medium">검색 결과가 없어요</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ COURSE ═══ */
const COURSES=[
  {id:1,title:"성수 볼거리 많은 팝업 여기!",subtitle:"찰리픽",
    stops:["NewJeans × Musinsa","MARDI MERCREDI","Gentle Monster"],walkTimes:[7,8],
    areas:["성수","홍대"],saves:11},
  {id:2,title:"강남·청담 아트&럭셔리",subtitle:"찰리픽",
    stops:["LOEWE Craft Prize","aespa × Adobe","Porsche Dream Big"],walkTimes:[10,12],
    areas:["청담","강남"],saves:6},
  {id:3,title:"한남·잠실 스포츠 코스",subtitle:"찰리픽",
    stops:["Arc'teryx Seoul","Nike Jordan Brand"],walkTimes:[25],
    areas:["한남","잠실"],saves:3},
];

function CharliePickCard({ course, rank }:{ course:typeof COURSES[number]; rank:number }) {
  const [saved,setSaved]=useState(false);
  const totalWalk=course.walkTimes.reduce((a,b)=>a+b,0);
  const medalColor=rank===1?"#F59E0B":rank===2?"#94A3B8":rank===3?"#B45309":"#CBD5E1";

  function share(){
    const text=`${course.title} · 찰리의 팝업 공장`;
    if(navigator.share) navigator.share({title:course.title,text}).catch(()=>{});
    else if(navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{});
  }

  return (
    <div className="rounded-xl bg-white p-4" style={{boxShadow:"0 2px 16px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-extrabold flex-shrink-0" style={{background:medalColor}}>
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold text-[#0A1628] truncate">{course.title}</h3>
            <span className="text-xs font-semibold text-[#6B7A99] flex-shrink-0">🚶 {totalWalk}분</span>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:"#F3EAFE",color:"#9333EA"}}>{course.subtitle}</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{background:"#F0F4FF",color:"#6B7A99"}}>팝업 {course.stops.length}개</span>
            {course.areas.map(a=><span key={a} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{background:"#F0F4FF",color:"#6B7A99"}}>{a}</span>)}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3" style={{borderTop:"1px solid rgba(34,99,236,0.07)"}}>
        {course.stops.map((stop,i)=>(
          <div key={stop}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{background:"#E8F1FF",color:"#2263EC"}}>{i+1}</span>
              <span className="text-sm text-[#0A1628] font-medium truncate">{stop}</span>
            </div>
            {i<course.stops.length-1&&(
              <div className="flex items-center gap-2 pl-2.5 my-1">
                <span className="text-[10px]" style={{color:"#CBD5E1"}}>⋮</span>
                <span className="text-[11px] text-[#94A3B8]">🚶 {course.walkTimes[i]}분</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-[#6B7A99] mt-3 flex items-center gap-1"><Users size={11}/> <b className="text-[#0A1628]">{course.saves}명</b>이 이 코스를 일정에 담았어요</p>

      <div className="flex gap-2 mt-3">
        <button onClick={share} className="flex-1 py-2.5 rounded-lg text-xs font-bold" style={{background:"#F0F4FF",color:"#0A1628"}}>공유하기</button>
        <button onClick={()=>setSaved(v=>!v)}
          className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1"
          style={{background:saved?"#10B981":"#2263EC"}}>
          {saved?(<><CheckCircle size={12}/> 담았어요</>):"이 코스 담기"}
        </button>
      </div>
    </div>
  );
}

const MAP_AREA_POS:Record<string,{x:number;y:number}> = {
  "홍대":{x:18,y:32}, "성수":{x:58,y:28}, "한남":{x:44,y:52},
  "강남":{x:66,y:64}, "청담":{x:76,y:48}, "잠실":{x:88,y:66},
};
const STATUS_FILTERS=["전체","오픈예정","운영중","종료임박"] as const;
type StatusFilter = typeof STATUS_FILTERS[number];
const WEEKDAYS=["일","월","화","수","목","금","토"];

function dayOfMonth(dateStr:string){ return parseInt(dateStr.split(".")[1],10); }
function weekdayOf(day:number){ return WEEKDAYS[(2+(day-1))%7]; } // 2025.07.01 = 화요일
function popupStatusOnDay(p:Popup, day:number):StatusFilter|"종료"{
  const s=dayOfMonth(p.startDate), e=dayOfMonth(p.endDate);
  if(day<s) return "오픈예정";
  if(day>e) return "종료";
  if(e-day<=1) return "종료임박";
  return "운영중";
}

const WAIT_MINUTES:Record<string,number>={"여유":8,"보통":18,"혼잡":32,"매우 혼잡":48};

const MY_LOCATION_AREA="성수";

function estimateDistanceKm(areaA:string, areaB:string){
  const a=MAP_AREA_POS[areaA]||{x:50,y:50};
  const b=MAP_AREA_POS[areaB]||{x:50,y:50};
  return Math.round(Math.hypot(a.x-b.x, a.y-b.y)*0.15*10)/10;
}

type VibePref="조용한 편"|"북적이는 편";

function buildAiCourse(selPrefs:string[], vibePref:VibePref, radiusKm:number){
  const matched=ALL_POPUPS.filter(p=>selPrefs.includes(toFindCategory(p.category)));
  const pool=matched.length>0?matched:ALL_POPUPS;

  const scored=pool
    .map(p=>{
      const distance=estimateDistanceKm(MY_LOCATION_AREA,p.area);
      const vibeMatch=vibePref==="북적이는 편"
        ?(p.congestion==="혼잡"||p.congestion==="매우 혼잡"?2:p.congestion==="보통"?1:0)
        :(p.congestion==="여유"?2:p.congestion==="보통"?1:0);
      const withinRadius=distance<=radiusKm;
      const discoveryBonus=p.isHot?1:0;
      const score=(withinRadius?3:0)+vibeMatch*2+discoveryBonus-distance*0.1;
      return {p,distance,score};
    })
    .sort((a,b)=>b.score-a.score);

  const stops=scored.slice(0,3).map(s=>s.p);
  const areas=Array.from(new Set(stops.map(p=>p.area)));
  const totalWait=stops.reduce((sum,p)=>sum+(WAIT_MINUTES[p.congestion]||15),0);
  const maxDistance=Math.max(0,...scored.slice(0,3).map(s=>s.distance));
  const walkTimes=stops.slice(0,-1).map((p,i)=>
    Math.max(3,Math.round(estimateDistanceKm(p.area,stops[i+1].area)*13)));

  return { title:`나만의 ${areas.join("·")} 코스`, stops, totalWait:`약 ${totalWait}분`, maxDistance, walkTimes };
}

function CoursePage({ liked, onToggleLike, onOpenDetail, aiCredits, onUseCredit }:{
  liked:Set<number>; onToggleLike:(id:number)=>void; onOpenDetail:(id:number)=>void; aiCredits:number; onUseCredit:()=>void;
}) {
  const [generating,setGenerating]=useState(false);
  const [generated,setGenerated]=useState(false);
  const [selPrefs,setSelPrefs]=useState<string[]>(["패션","문구/아트"]);
  const [vibePref,setVibePref]=useState<VibePref>("조용한 편");
  const [radiusPref,setRadiusPref]=useState(5);
  const prefs=FIND_CATEGORIES.filter(c=>c!=="기타");

  const [selDay,setSelDay]=useState(5);
  const [mapCat,setMapCat]=useState("전체");
  const [showCatRow,setShowCatRow]=useState(false);
  const [onlyPreOrder,setOnlyPreOrder]=useState(false);
  const [onlyLiked,setOnlyLiked]=useState(false);
  const [courseQuery,setCourseQuery]=useState("");
  const [sheetTab,setSheetTab]=useState<"AI"|"찰리픽">("AI");
  const [sheetExpanded,setSheetExpanded]=useState(false);
  const dayList=Array.from({length:31},(_,i)=>i+1);

  const q=courseQuery.trim().toLowerCase();
  const mapPopups = ALL_POPUPS
    .map(p=>({p,status:popupStatusOnDay(p,selDay)}))
    .filter(({status})=>status!=="종료")
    .filter(({p})=>mapCat==="전체"||p.category===mapCat)
    .filter(({p})=>!onlyPreOrder||p.reservationType==="사전 예약")
    .filter(({p})=>!onlyLiked||liked.has(p.id))
    .filter(({p})=>!q||p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q));

  const now=new Date();
  const isOperatingHours = now.getHours()>=10 && now.getHours()<20;
  const WEATHER={temp:27,desc:"맑음",emoji:"☀️",tip:"야외 팝업 방문하기 좋은 날씨예요"};
  const aiCourse=buildAiCourse(selPrefs,vibePref,radiusPref);
  const vibeNote=vibePref==="북적이는 편"?"활기찬 분위기의 팝업 위주로":"여유롭게 즐길 수 있는 팝업 위주로";
  const weatherNote=WEATHER.desc==="맑음"?"화창한 날씨라 이동 동선도 부담 없게":"날씨를 고려해 실내 위주로";
  const aiNote=`${vibeNote} · ${weatherNote} ${MY_LOCATION_AREA} 기준 반경 ${radiusPref}km(최대 ${aiCourse.maxDistance}km) 안에서 구성했어요`;

  return (
    <div className="max-w-6xl mx-auto flex flex-col relative" style={{height:"calc(100vh - 61px)"}}>
      {/* 검색 */}
      <div className="px-6 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2 rounded-full px-4 py-3" style={{background:"#F0F4FF"}}>
          <Search size={16} color="#6B7A99" className="flex-shrink-0"/>
          <input value={courseQuery} onChange={e=>setCourseQuery(e.target.value)} placeholder="궁금한 팝업을 검색해 보세요"
            className="bg-transparent flex-1 outline-none text-sm text-[#0A1628] placeholder-[#6B7A99]"/>
        </div>
      </div>

      {/* 날짜 스트립 */}
      <div className="flex items-center gap-1.5 px-6 pb-3 flex-shrink-0 overflow-x-auto scrollbar-hide">
        <button className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{background:"#F0F4FF"}}>
          <CalendarDays size={15} color="#2263EC"/>
        </button>
        {dayList.map(day=>{
          const wd=weekdayOf(day);
          const isSel=day===selDay, isToday=day===5;
          const wdColor=wd==="토"?"#3B82F6":wd==="일"?"#EF4444":"#6B7A99";
          return (
            <button key={day} onClick={()=>setSelDay(day)}
              className="flex-shrink-0 w-11 py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all"
              style={{background:isSel?"#0A1628":"transparent"}}>
              <span className="text-[10px] font-semibold" style={{color:isSel?"rgba(255,255,255,0.7)":wdColor}}>{isToday?"오늘":wd}</span>
              <span className="text-sm font-extrabold" style={{color:isSel?"#fff":"#0A1628"}}>{day}</span>
            </button>
          );
        })}
      </div>

      {/* 지도 */}
      <div className="relative flex-1 overflow-hidden">
        {/* 필터 칩 */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={()=>setShowCatRow(v=>!v)}
            className="flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1"
            style={{background:"#fff",boxShadow:"0 2px 10px rgba(0,0,0,0.12)",color:mapCat!=="전체"?"#2263EC":"#0A1628"}}>
            카테고리{mapCat!=="전체"?` · ${mapCat}`:""}
            <ChevronRight size={11} style={{transform:showCatRow?"rotate(-90deg)":"rotate(90deg)"}}/>
          </button>
          <button onClick={()=>setOnlyPreOrder(v=>!v)}
            className="flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold"
            style={onlyPreOrder?{background:"#2263EC",color:"#fff"}:{background:"#fff",color:"#0A1628",boxShadow:"0 2px 10px rgba(0,0,0,0.12)"}}>
            사전예약
          </button>
          <button onClick={()=>setOnlyLiked(v=>!v)}
            className="flex-shrink-0 px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1"
            style={onlyLiked?{background:"#2263EC",color:"#fff"}:{background:"#fff",color:"#0A1628",boxShadow:"0 2px 10px rgba(0,0,0,0.12)"}}>
            <Heart size={11} fill={onlyLiked?"#fff":"none"}/> 찜한 팝업
          </button>
        </div>
        {showCatRow&&(
          <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
            className="absolute left-3 right-3 z-20 flex flex-wrap gap-1.5 p-2.5 rounded-xl" style={{top:52,background:"rgba(255,255,255,0.97)",backdropFilter:"blur(6px)",boxShadow:"0 6px 20px rgba(0,0,0,0.14)"}}>
            {CATS.map(c=>(
              <button key={c} onClick={()=>{setMapCat(c);setShowCatRow(false);}} className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
                style={mapCat===c?{background:"#2263EC",color:"#fff"}:{background:"#F0F4FF",color:"#6B7A99"}}>{c}</button>
            ))}
          </motion.div>
        )}

        {/* 지도 배경 */}
        <div className="absolute inset-0" style={{background:"linear-gradient(160deg,#EAF1FE 0%,#F5F8FF 100%)"}}>
          <div className="absolute inset-0 opacity-50" style={{backgroundImage:"linear-gradient(rgba(34,99,236,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(34,99,236,0.08) 1px,transparent 1px)",backgroundSize:"40px 40px"}}/>
          <div className="absolute" style={{left:"-10%",top:"52%",width:"130%",height:30,background:"linear-gradient(90deg,rgba(96,165,250,0.4),rgba(147,197,253,0.55),rgba(96,165,250,0.4))",transform:"rotate(-5deg)",borderRadius:20}}/>
          <div className="absolute rounded-full" style={{left:"10%",top:"16%",width:64,height:44,background:"rgba(110,231,183,0.35)"}}/>
          <div className="absolute rounded-full" style={{left:"66%",top:"66%",width:80,height:52,background:"rgba(110,231,183,0.3)"}}/>
          <div className="absolute rounded-full" style={{left:"36%",top:"72%",width:44,height:34,background:"rgba(110,231,183,0.28)"}}/>
          {Object.entries(MAP_AREA_POS).map(([area,pos])=>(
            <span key={area} className="absolute text-[13px] font-extrabold pointer-events-none select-none whitespace-nowrap"
              style={{left:`${pos.x}%`,top:`${pos.y}%`,transform:"translate(-50%,-50%)",color:"rgba(10,22,40,0.16)"}}>
              {area}
            </span>
          ))}
          {mapPopups.map(({p,status})=>{
            const pos=MAP_AREA_POS[p.area]||{x:50,y:50};
            const color=status==="오픈예정"?"#F59E0B":status==="종료임박"?"#EF4444":"#2263EC";
            return (
              <button key={p.id} onClick={()=>onOpenDetail(p.id)}
                className="absolute flex flex-col items-center"
                style={{left:`${pos.x}%`,top:`${pos.y}%`,transform:"translate(-50%,-100%)"}}>
                <span className="text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap mb-1"
                  style={{background:color,boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>{p.name.split(" ")[0]}</span>
                <MapPin size={22} color={color} fill={color} fillOpacity={0.18}/>
              </button>
            );
          })}
          {mapPopups.length===0&&(
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <p className="text-xs text-[#6B7A99] text-center">조건에 맞는 팝업이 없어요</p>
            </div>
          )}
        </div>
      </div>

      {/* 바텀시트 */}
      <motion.div animate={{height:sheetExpanded?"96%":210}} transition={{type:"spring",damping:28,stiffness:280}}
          className="absolute left-0 right-0 bottom-0 z-30 flex flex-col rounded-t-2xl bg-white overflow-hidden"
          style={{boxShadow:"0 -8px 30px rgba(0,0,0,0.14)"}}>
          <button onClick={()=>setSheetExpanded(v=>!v)} className="flex flex-col items-center pt-2.5 pb-2 flex-shrink-0">
            <span className="w-9 h-1 rounded-full mb-1.5" style={{background:"#E2E8F0"}}/>
            <span className="text-[11px] text-[#94A3B8] flex items-center gap-1">
              {sheetExpanded?"탭하여 축소하기":"탭하여 확대하기"}
              <ChevronRight size={11} style={{transform:sheetExpanded?"rotate(90deg)":"rotate(-90deg)"}}/>
            </span>
          </button>
          <div className="flex gap-5 px-4 flex-shrink-0" style={{borderBottom:"1px solid rgba(34,99,236,0.08)"}}>
            {([{key:"AI",label:"AI 추천 코스"},{key:"찰리픽",label:"찰리픽 추천 코스"}] as const).map(t=>(
              <button key={t.key} onClick={()=>setSheetTab(t.key)} className="relative py-2.5 text-sm font-bold">
                <span style={{color:sheetTab===t.key?"#0A1628":"#94A3B8"}}>{t.label}</span>
                {sheetTab===t.key&&<span className="absolute left-0 right-0 bottom-0 h-[2px]" style={{background:"#2263EC"}}/>}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="max-w-3xl mx-auto">
              {sheetTab==="AI"?(
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon3D gradient="linear-gradient(145deg,#4F8EF7,#2263EC)" size={40}><Sparkles size={18} color="#fff"/></Icon3D>
                    <div>
                      <h2 className="font-bold text-[#0A1628] text-sm">AI 개인화 코스 생성</h2>
                      <p className="text-xs text-[#6B7A99]">취향 선택 → 위치 기반 → 대기 최소화 최적화</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide mb-2">관심 카테고리</p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {prefs.map(p=>(
                      <button key={p}
                        onClick={()=>setSelPrefs(prev=>prev.includes(p)?prev.filter(x=>x!==p):[...prev,p])}
                        className="px-2 py-1.5 rounded-full text-xs font-semibold transition-all truncate"
                        style={selPrefs.includes(p)?{background:"#2263EC",color:"#fff"}:{background:"#F0F4FF",color:"#6B7A99"}}>
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide mb-2">분위기 선호</p>
                  <div className="flex gap-2 mb-4">
                    {(["조용한 편","북적이는 편"] as const).map(v=>(
                      <button key={v} onClick={()=>setVibePref(v)}
                        className="flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={vibePref===v?{background:"#2263EC",color:"#fff"}:{background:"#F0F4FF",color:"#6B7A99"}}>
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide">이동 반경</p>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-[#2263EC] ml-1">
                      <LocateFixed size={12}/> 현재 내 위치 기준 · {MY_LOCATION_AREA}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {[2,5,10].map(r=>(
                      <button key={r} onClick={()=>setRadiusPref(r)}
                        className="flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                        style={radiusPref===r?{background:"#2263EC",color:"#fff"}:{background:"#F0F4FF",color:"#6B7A99"}}>
                        반경 {r}km
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mb-4 rounded-xl px-3.5 py-2.5" style={{background:"#FFF7ED"}}>
                    <span className="text-lg flex-shrink-0">{WEATHER.emoji}</span>
                    <p className="text-xs text-[#0A1628] font-medium">오늘 서울 <span className="font-bold">{WEATHER.temp}°C · {WEATHER.desc}</span> — {WEATHER.tip}</p>
                  </div>
                  <button onClick={()=>{
                      if(aiCredits<=0) return;
                      onUseCredit();
                      setGenerating(true);
                      setTimeout(()=>{setGenerating(false);setGenerated(true);},2000);
                    }}
                    disabled={generating||aiCredits<=0}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{background:generating?"#93B4F5":"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:generating?"none":"0 4px 16px rgba(34,99,236,0.35)"}}>
                    {generating?(
                      <><motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:1,ease:"linear"}}><Sparkles size={16}/></motion.div>AI가 최적 코스를 계산 중이에요...</>
                    ):aiCredits>0?(
                      <><Sparkles size={16}/> 나만의 코스 생성하기 (무료 {aiCredits}회 남음)</>
                    ):(
                      <>무료 체험을 모두 사용했어요</>
                    )}
                  </button>
                  {generated&&(
                    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                      className="mt-4 p-4 rounded-xl bg-white"
                      style={{border:"1.5px solid rgba(34,99,236,0.15)",boxShadow:"0 2px 12px rgba(34,99,236,0.08)"}}>
                      <p className="text-xs text-[#2263EC] font-bold mb-2 flex items-center gap-1"><Sparkles size={12}/> {selPrefs.join("·")} 취향 맞춤 코스 완성!</p>
                      <h3 className="font-bold text-[#0A1628] text-base mb-3">{aiCourse.title}</h3>
                      <div className="flex flex-col">
                        {aiCourse.stops.map((stop,i)=>(
                          <div key={stop.id}>
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0"
                                style={{background:"#2263EC",boxShadow:"0 2px 6px rgba(34,99,236,0.4)"}}>{i+1}</div>
                              <span className="text-xs text-[#0A1628] font-medium">{stop.name}</span>
                              <CongestionBadge level={stop.congestion}/>
                            </div>
                            {i<aiCourse.stops.length-1&&(
                              <div className="flex items-center gap-2 pl-3 my-1">
                                <span className="text-[10px]" style={{color:"#CBD5E1"}}>⋮</span>
                                <span className="text-[11px] text-[#94A3B8]">🚶 {aiCourse.walkTimes[i]}분</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-3 mb-2">
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1" style={{background:"#E8F1FF",color:"#2263EC"}}>
                          <TrendingUp size={11}/> 혼잡도 반영 · 총 예상 대기 {aiCourse.totalWait}
                        </span>
                      </div>
                      <p className="text-xs text-[#2263EC] flex items-center gap-1 rounded-lg px-3 py-2 mb-2" style={{background:"#E8F1FF"}}>
                        <Clock size={11}/> {aiNote}
                      </p>
                      <p className="text-xs flex items-center gap-1 rounded-lg px-3 py-2"
                        style={isOperatingHours?{background:"#ECFDF5",color:"#10B981"}:{background:"#FFF7ED",color:"#F97316"}}>
                        <CheckCircle size={11}/> 현재 시각 {String(now.getHours()).padStart(2,"0")}:{String(now.getMinutes()).padStart(2,"0")} 기준 ·{" "}
                        {isOperatingHours?"코스의 모든 팝업이 현재 운영 중이에요":"현재는 운영시간 외예요. 내일 방문 기준으로 참고해주세요"}
                      </p>
                    </motion.div>
                  )}
                </div>
              ):(
                <div className="grid gap-4 pb-4">
                  {COURSES.map((course,i)=><CharliePickCard key={course.id} course={course} rank={i+1}/>)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
    </div>
  );
}

/* ═══ CALENDAR ═══ */
const CAL_EVENTS:Record<number,Popup[]>={
  1:[ALL_POPUPS[0],ALL_POPUPS[2]],5:[ALL_POPUPS[1],ALL_POPUPS[6]],
  8:[ALL_POPUPS[5],ALL_POPUPS[3]],10:[ALL_POPUPS[4]],
  12:[ALL_POPUPS[7]],14:[ALL_POPUPS[0]],20:[ALL_POPUPS[1],ALL_POPUPS[4]]
};

function CalendarPage() {
  const [selDay,setSelDay]=useState(5);
  const days=["일","월","화","수","목","금","토"];
  const cells=Array.from({length:2+31},(_,i)=>i<2?null:i-2+1);
  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
      <h1 className="text-3xl font-extrabold text-[#0A1628] mb-2">팝업 <span style={{color:"#2263EC"}}>캘린더</span></h1>
      <p className="text-sm text-[#6B7A99] mb-6">2025년 7월 · 관심 팝업 일정을 등록하고 알림받아요</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl p-5" style={{boxShadow:"0 4px 24px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#0A1628] text-lg">2025년 7월</h2>
            <button className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{background:"#E8F1FF",color:"#2263EC"}}>
              <Bell size={11}/> 알림 설정
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map((d,i)=>(
              <div key={d} className={`text-center text-xs font-bold py-1 ${i===0?"text-red-400":i===6?"text-[#2263EC]":"text-[#6B7A99]"}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day,i)=>{
              const hasEvent=day!==null&&CAL_EVENTS[day];
              const isSel=day===selDay;
              const isToday=day===5;
              return (
                <button key={i} onClick={()=>day!==null&&setSelDay(day)}
                  className="aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all"
                  style={day===null?{visibility:"hidden"}:
                    isSel?{background:"#2263EC",color:"#fff",boxShadow:"0 4px 12px rgba(34,99,236,0.35)"}:
                    isToday?{background:"#E8F1FF",color:"#2263EC"}:{color:"#0A1628"}}>
                  {day}
                  {hasEvent&&!isSel&&(
                    <div className="flex gap-0.5 mt-0.5">
                      {(CAL_EVENTS[day as number]||[]).slice(0,3).map((_,j)=>(
                        <div key={j} className="w-1 h-1 rounded-full" style={{backgroundColor:"#2263EC"}}/>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5" style={{boxShadow:"0 4px 24px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
          <h3 className="font-bold text-[#0A1628] mb-0.5">7월 {selDay}일</h3>
          <p className="text-xs text-[#6B7A99] mb-4">{CAL_EVENTS[selDay]?`${CAL_EVENTS[selDay].length}개 팝업 운영 중`:"등록된 팝업 없음"}</p>
          {CAL_EVENTS[selDay]?(
            <div className="flex flex-col gap-3">
              {CAL_EVENTS[selDay].map(p=>(
                <div key={p.id} className="flex gap-3 p-3 rounded-xl" style={{background:"#F7F9FF"}}>
                  <img src={imgUrl(p.imgId,80,80)} alt={p.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0A1628] truncate">{p.name}</p>
                    <p className="text-xs text-[#6B7A99] flex items-center gap-1 mt-0.5"><MapPin size={10}/> {p.area}</p>
                    <div className="mt-1"><CongestionBadge level={p.congestion}/></div>
                  </div>
                </div>
              ))}
            </div>
          ):(
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{background:"#E8F1FF"}}>
                <CalendarDays size={22} color="#2263EC"/>
              </div>
              <p className="text-xs text-[#6B7A99]">이 날은 조용해요</p>
            </div>
          )}
          <button className="w-full mt-4 py-2.5 rounded-xl text-xs text-[#2263EC] font-semibold flex items-center justify-center gap-2"
            style={{border:"1.5px dashed rgba(34,99,236,0.3)",background:"#F7F9FF"}}>
            <PlusCircle size={13}/> 관심 팝업 일정 추가
          </button>
        </div>
      </div>
      <div className="mt-5 bg-white rounded-xl p-5" style={{boxShadow:"0 4px 24px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
        <h3 className="font-bold text-[#0A1628] mb-4 flex items-center gap-2">
          <Icon3D gradient="linear-gradient(145deg,#4F8EF7,#2263EC)" size={32}><Bookmark size={14} color="#fff"/></Icon3D>
          내 관심 팝업 일정
        </h3>
        <div className="grid gap-3 lg:grid-cols-2">
          {[ALL_POPUPS[0],ALL_POPUPS[4]].map((p,i)=>(
            <div key={p.id} className="flex items-center gap-4 p-3.5 rounded-xl" style={{background:"#F7F9FF"}}>
              <img src={imgUrl(p.imgId,100,100)} alt={p.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0"/>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#0A1628] truncate">{p.name}</p>
                <p className="text-xs text-[#6B7A99]">{p.startDate}–{p.endDate} · {p.area}</p>
                <div className="mt-1.5"><CongestionBadge level={p.congestion}/></div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-extrabold" style={{color:"#2263EC"}}>D-{[8,15][i]}</div>
                <div className="text-[10px] text-[#6B7A99]">남음</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══ AUTH ═══ */
function AuthShell({ title, subtitle, children }:{ title:React.ReactNode; subtitle?:string; children:React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-6 py-14"
      style={{background:"linear-gradient(160deg,#EBF2FF 0%,#F7F9FF 55%,#FFFFFF 100%)"}}>
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
        className="w-full max-w-md bg-white rounded-xl p-8"
        style={{boxShadow:"0 8px 40px rgba(34,99,236,0.12)",border:"1px solid rgba(34,99,236,0.08)"}}>
        <h1 className="text-2xl font-extrabold text-[#0A1628] mb-1 text-center" style={{letterSpacing:"-0.02em"}}>{title}</h1>
        {subtitle&&<p className="text-sm text-[#6B7A99] mb-7 text-center">{subtitle}</p>}
        {children}
      </motion.div>
    </div>
  );
}

function AuthField({ icon, type="text", value, onChange, placeholder, rightSlot }:{
  icon:React.ReactNode; type?:string; value:string; onChange:(v:string)=>void; placeholder:string; rightSlot?:React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 mb-3"
      style={{border:"1.5px solid rgba(34,99,236,0.15)"}}>
      {icon}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 outline-none text-sm text-[#0A1628] placeholder-[#6B7A99] bg-transparent"/>
      {rightSlot}
    </div>
  );
}

function GoogleButton({ label, onClick }:{ label:string; onClick:()=>void }) {
  return (
    <button onClick={onClick} type="button"
      className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-3"
      style={{background:"#fff",border:"1.5px solid rgba(10,22,40,0.12)",color:"#0A1628"}}>
      <span className="text-base">G</span> {label}
    </button>
  );
}

function PrimaryButton({ label, onClick, disabled, icon }:{ label:string; onClick:()=>void; disabled?:boolean; icon?:React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} type="button"
      className="w-full py-3.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      style={{background:disabled?"#93B4F5":"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:disabled?"none":"0 4px 16px rgba(34,99,236,0.35)"}}>
      {icon}{label}
    </button>
  );
}

function LoginPage({ onLogin, goTo }:{ onLogin:(u:UserAccount)=>void; goTo:(p:Page)=>void }) {
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [error,setError]=useState("");

  function submit(){
    if(!email||!pw){ setError("이메일과 비밀번호를 입력해주세요"); return; }
    setError("");
    onLogin({ name: email.split("@")[0], email, provider:"local" });
    goTo("home");
  }

  return (
    <AuthShell title={<>로그인하고 <span style={{color:"#2263EC"}}>팝업</span> 즐기기</>} subtitle="찰리의 팝업 공장에 오신 걸 환영해요">
      <GoogleButton label="구글 계정으로 로그인" onClick={()=>{ onLogin({name:"구글사용자",email:"google.user@gmail.com",provider:"google"}); goTo("home"); }}/>
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px" style={{background:"rgba(34,99,236,0.12)"}}/>
        <span className="text-xs text-[#6B7A99]">또는</span>
        <div className="flex-1 h-px" style={{background:"rgba(34,99,236,0.12)"}}/>
      </div>
      <AuthField icon={<Mail size={16} color="#2263EC"/>} type="email" value={email} onChange={setEmail} placeholder="이메일"/>
      <AuthField icon={<Lock size={16} color="#2263EC"/>} type={showPw?"text":"password"} value={pw} onChange={setPw} placeholder="비밀번호"
        rightSlot={<button type="button" onClick={()=>setShowPw(!showPw)}>{showPw?<EyeOff size={15} color="#6B7A99"/>:<Eye size={15} color="#6B7A99"/>}</button>}/>
      {error&&<p className="text-xs text-red-500 mb-3">{error}</p>}
      <div className="flex justify-end gap-3 mb-4 text-xs text-[#6B7A99]">
        <button onClick={()=>goTo("findId")} className="hover:text-[#2263EC]">아이디 찾기</button>
        <span>·</span>
        <button onClick={()=>goTo("findPassword")} className="hover:text-[#2263EC]">비밀번호 찾기</button>
      </div>
      <PrimaryButton label="로그인" onClick={submit}/>
      <p className="text-center text-xs text-[#6B7A99] mt-5">
        아직 계정이 없으신가요? <button onClick={()=>goTo("signup")} className="font-bold text-[#2263EC]">회원가입</button>
      </p>
    </AuthShell>
  );
}

function SignupPage({ onSignupComplete, goTo }:{ onSignupComplete:(u:UserAccount)=>void; goTo:(p:Page)=>void }) {
  const [step,setStep]=useState(1);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [pwConfirm,setPwConfirm]=useState("");
  const [error,setError]=useState("");

  const [codeSent,setCodeSent]=useState(false);
  const [code,setCode]=useState("");
  const [emailVerified,setEmailVerified]=useState(false);

  const [agreeAll,setAgreeAll]=useState(false);
  const [agreeTerms,setAgreeTerms]=useState(false);
  const [agreePrivacy,setAgreePrivacy]=useState(false);
  const [agreeMarketing,setAgreeMarketing]=useState(false);

  function toggleAll(v:boolean){ setAgreeAll(v); setAgreeTerms(v); setAgreePrivacy(v); setAgreeMarketing(v); }

  function submitStep1(){
    if(!name||!email||!pw||!pwConfirm){ setError("모든 항목을 입력해주세요"); return; }
    if(pw.length<8){ setError("비밀번호는 8자 이상이어야 해요"); return; }
    if(pw!==pwConfirm){ setError("비밀번호가 일치하지 않아요"); return; }
    setError(""); setStep(2);
  }
  function verifyCode(){
    if(code===MOCK_AUTH_CODE){ setEmailVerified(true); setError(""); }
    else setError("인증번호가 올바르지 않아요 (테스트 코드: 123456)");
  }
  function complete(){
    onSignupComplete({ name, email, provider:"local" });
    goTo("home");
  }

  const steps=["정보 입력","이메일 인증","약관 동의"];

  return (
    <AuthShell title="회원가입" subtitle="찰리의 팝업 공장과 함께 취향 저격 팝업을 만나보세요">
      <div className="flex items-center gap-2 mb-7">
        {steps.map((s,i)=>(
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={i+1<=step?{background:"#2263EC",color:"#fff"}:{background:"#E8F1FF",color:"#6B7A99"}}>
              {i+1<step?<Check size={12}/>:i+1}
            </div>
            <span className="text-[11px] font-semibold whitespace-nowrap" style={{color:i+1===step?"#2263EC":"#6B7A99"}}>{s}</span>
            {i<steps.length-1&&<div className="flex-1 h-px" style={{background:"rgba(34,99,236,0.15)"}}/>}
          </div>
        ))}
      </div>

      {step===1&&(
        <>
          <GoogleButton label="구글로 3초만에 가입하기" onClick={()=>{ onSignupComplete({name:"구글사용자",email:"google.user@gmail.com",provider:"google"}); goTo("home"); }}/>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{background:"rgba(34,99,236,0.12)"}}/>
            <span className="text-xs text-[#6B7A99]">또는 이메일로 가입</span>
            <div className="flex-1 h-px" style={{background:"rgba(34,99,236,0.12)"}}/>
          </div>
          <AuthField icon={<UserIcon size={16} color="#2263EC"/>} value={name} onChange={setName} placeholder="이름"/>
          <AuthField icon={<Mail size={16} color="#2263EC"/>} type="email" value={email} onChange={setEmail} placeholder="이메일"/>
          <AuthField icon={<Lock size={16} color="#2263EC"/>} type="password" value={pw} onChange={setPw} placeholder="비밀번호 (8자 이상)"/>
          <AuthField icon={<Lock size={16} color="#2263EC"/>} type="password" value={pwConfirm} onChange={setPwConfirm} placeholder="비밀번호 확인"/>
          {error&&<p className="text-xs text-red-500 mb-3">{error}</p>}
          <PrimaryButton label="다음" onClick={submitStep1}/>
        </>
      )}

      {step===2&&(
        <>
          <p className="text-sm text-[#0A1628] mb-4"><span className="font-bold">{email}</span>로 인증번호를 보내드려요</p>
          <div className="flex gap-2 mb-3">
            <div className="flex-1"><AuthField icon={<Mail size={16} color="#2263EC"/>} value={email} onChange={()=>{}} placeholder="이메일"/></div>
            <button onClick={()=>setCodeSent(true)} className="px-4 rounded-xl text-xs font-bold flex-shrink-0" style={{background:"#E8F1FF",color:"#2263EC"}}>
              {codeSent?"재발송":"인증번호 발송"}
            </button>
          </div>
          {codeSent&&(
            <>
              <p className="text-xs text-[#2263EC] mb-2">인증번호가 발송되었어요 (테스트: {MOCK_AUTH_CODE})</p>
              <div className="flex gap-2 mb-3">
                <div className="flex-1"><AuthField icon={<ShieldCheck size={16} color="#2263EC"/>} value={code} onChange={setCode} placeholder="인증번호 6자리"/></div>
                <button onClick={verifyCode} className="px-4 rounded-xl text-xs font-bold flex-shrink-0" style={{background:"#2263EC",color:"#fff"}}>확인</button>
              </div>
            </>
          )}
          {emailVerified&&<p className="text-xs text-green-600 font-semibold mb-3 flex items-center gap-1"><Check size={13}/> 이메일 인증이 완료되었어요</p>}
          {error&&<p className="text-xs text-red-500 mb-3">{error}</p>}
          <PrimaryButton label="다음" onClick={()=>setStep(3)} disabled={!emailVerified}/>
        </>
      )}

      {step===3&&(
        <>
          <label className="flex items-center gap-2.5 py-3 border-b cursor-pointer" style={{borderColor:"rgba(34,99,236,0.1)"}}>
            <input type="checkbox" checked={agreeAll} onChange={e=>toggleAll(e.target.checked)} className="w-4 h-4 accent-[#2263EC]"/>
            <span className="text-sm font-bold text-[#0A1628]">전체 동의</span>
          </label>
          <label className="flex items-center gap-2.5 py-2.5 cursor-pointer">
            <input type="checkbox" checked={agreeTerms}
              onChange={e=>{ setAgreeTerms(e.target.checked); setAgreeAll(e.target.checked&&agreePrivacy&&agreeMarketing); }}
              className="w-4 h-4 accent-[#2263EC]"/>
            <span className="text-sm text-[#0A1628]">[필수] 이용약관 동의</span>
          </label>
          <label className="flex items-center gap-2.5 py-2.5 cursor-pointer">
            <input type="checkbox" checked={agreePrivacy}
              onChange={e=>{ setAgreePrivacy(e.target.checked); setAgreeAll(e.target.checked&&agreeTerms&&agreeMarketing); }}
              className="w-4 h-4 accent-[#2263EC]"/>
            <span className="text-sm text-[#0A1628]">[필수] 개인정보 처리방침 동의</span>
          </label>
          <label className="flex items-center gap-2.5 py-2.5 cursor-pointer">
            <input type="checkbox" checked={agreeMarketing}
              onChange={e=>{ setAgreeMarketing(e.target.checked); setAgreeAll(e.target.checked&&agreeTerms&&agreePrivacy); }}
              className="w-4 h-4 accent-[#2263EC]"/>
            <span className="text-sm text-[#0A1628]">[선택] 마케팅 정보 수신 동의</span>
          </label>
          {error&&<p className="text-xs text-red-500 mt-2 mb-1">{error}</p>}
          <div className="mt-5"><PrimaryButton label="가입 완료" onClick={complete} disabled={!(agreeTerms&&agreePrivacy)}/></div>
        </>
      )}

      <p className="text-center text-xs text-[#6B7A99] mt-6">
        이미 계정이 있으신가요? <button onClick={()=>goTo("login")} className="font-bold text-[#2263EC]">로그인</button>
      </p>
    </AuthShell>
  );
}

function FindIdPage({ goTo }:{ goTo:(p:Page)=>void }) {
  const [email,setEmail]=useState("");
  const [codeSent,setCodeSent]=useState(false);
  const [code,setCode]=useState("");
  const [found,setFound]=useState(false);
  const [error,setError]=useState("");

  function verify(){
    if(code===MOCK_AUTH_CODE){ setFound(true); setError(""); }
    else setError("인증번호가 올바르지 않아요 (테스트 코드: 123456)");
  }
  function maskEmail(e:string){
    const [id,domain]=e.split("@");
    if(!domain) return e;
    return `${id.slice(0,2)}${"*".repeat(Math.max(id.length-2,1))}@${domain}`;
  }

  return (
    <AuthShell title="아이디 찾기" subtitle="가입 시 등록한 이메일로 인증 후 아이디를 확인하세요">
      {!found?(
        <>
          <div className="flex gap-2 mb-3">
            <div className="flex-1"><AuthField icon={<Mail size={16} color="#2263EC"/>} type="email" value={email} onChange={setEmail} placeholder="가입한 이메일"/></div>
            <button onClick={()=>setCodeSent(true)} className="px-4 rounded-xl text-xs font-bold flex-shrink-0" style={{background:"#E8F1FF",color:"#2263EC"}}>
              {codeSent?"재발송":"인증번호 발송"}
            </button>
          </div>
          {codeSent&&(
            <>
              <p className="text-xs text-[#2263EC] mb-2">인증번호가 발송되었어요 (테스트: {MOCK_AUTH_CODE})</p>
              <div className="flex gap-2 mb-3">
                <div className="flex-1"><AuthField icon={<ShieldCheck size={16} color="#2263EC"/>} value={code} onChange={setCode} placeholder="인증번호 6자리"/></div>
                <button onClick={verify} className="px-4 rounded-xl text-xs font-bold flex-shrink-0" style={{background:"#2263EC",color:"#fff"}}>확인</button>
              </div>
            </>
          )}
          {error&&<p className="text-xs text-red-500 mb-3">{error}</p>}
        </>
      ):(
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4" style={{background:"#E8F1FF"}}>
            <UserIcon size={26} color="#2263EC"/>
          </div>
          <p className="text-sm text-[#6B7A99] mb-1">회원님의 아이디는</p>
          <p className="text-lg font-extrabold text-[#0A1628] mb-6">{maskEmail(email||"user@example.com")}</p>
          <PrimaryButton label="로그인하러 가기" onClick={()=>goTo("login")}/>
        </div>
      )}
      <p className="text-center text-xs text-[#6B7A99] mt-6">
        <button onClick={()=>goTo("login")} className="hover:text-[#2263EC]">로그인</button>
        <span className="mx-2">·</span>
        <button onClick={()=>goTo("findPassword")} className="hover:text-[#2263EC]">비밀번호 찾기</button>
      </p>
    </AuthShell>
  );
}

function FindPasswordPage({ goTo }:{ goTo:(p:Page)=>void }) {
  const [step,setStep]=useState(1);
  const [id,setId]=useState("");
  const [codeSent,setCodeSent]=useState(false);
  const [code,setCode]=useState("");
  const [newPw,setNewPw]=useState("");
  const [newPwConfirm,setNewPwConfirm]=useState("");
  const [error,setError]=useState("");
  const [done,setDone]=useState(false);

  function submitId(){
    if(!id){ setError("아이디(이메일)를 입력해주세요"); return; }
    setError(""); setStep(2);
  }
  function verify(){
    if(code===MOCK_AUTH_CODE){ setStep(3); setError(""); }
    else setError("인증번호가 올바르지 않아요 (테스트 코드: 123456)");
  }
  function resetPw(){
    if(newPw.length<8){ setError("비밀번호는 8자 이상이어야 해요"); return; }
    if(newPw!==newPwConfirm){ setError("비밀번호가 일치하지 않아요"); return; }
    setError(""); setDone(true);
  }

  if(done){
    return (
      <AuthShell title="비밀번호 재설정 완료" subtitle="새 비밀번호로 로그인해주세요">
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4" style={{background:"#ECFDF5"}}>
            <Check size={26} color="#10B981"/>
          </div>
          <PrimaryButton label="로그인하러 가기" onClick={()=>goTo("login")}/>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="비밀번호 찾기" subtitle="아이디 확인과 이메일 인증 후 새 비밀번호를 설정하세요">
      {step===1&&(
        <>
          <AuthField icon={<UserIcon size={16} color="#2263EC"/>} type="email" value={id} onChange={setId} placeholder="아이디(이메일) 입력"/>
          {error&&<p className="text-xs text-red-500 mb-3">{error}</p>}
          <PrimaryButton label="다음" onClick={submitId}/>
        </>
      )}
      {step===2&&(
        <>
          <div className="flex gap-2 mb-3">
            <div className="flex-1"><AuthField icon={<Mail size={16} color="#2263EC"/>} value={id} onChange={()=>{}} placeholder="이메일"/></div>
            <button onClick={()=>setCodeSent(true)} className="px-4 rounded-xl text-xs font-bold flex-shrink-0" style={{background:"#E8F1FF",color:"#2263EC"}}>
              {codeSent?"재발송":"인증번호 발송"}
            </button>
          </div>
          {codeSent&&(
            <>
              <p className="text-xs text-[#2263EC] mb-2">인증번호가 발송되었어요 (테스트: {MOCK_AUTH_CODE})</p>
              <div className="flex gap-2 mb-3">
                <div className="flex-1"><AuthField icon={<ShieldCheck size={16} color="#2263EC"/>} value={code} onChange={setCode} placeholder="인증번호 6자리"/></div>
                <button onClick={verify} className="px-4 rounded-xl text-xs font-bold flex-shrink-0" style={{background:"#2263EC",color:"#fff"}}>확인</button>
              </div>
            </>
          )}
          {error&&<p className="text-xs text-red-500 mb-3">{error}</p>}
        </>
      )}
      {step===3&&(
        <>
          <AuthField icon={<Lock size={16} color="#2263EC"/>} type="password" value={newPw} onChange={setNewPw} placeholder="새 비밀번호 (8자 이상)"/>
          <AuthField icon={<Lock size={16} color="#2263EC"/>} type="password" value={newPwConfirm} onChange={setNewPwConfirm} placeholder="새 비밀번호 확인"/>
          {error&&<p className="text-xs text-red-500 mb-3">{error}</p>}
          <PrimaryButton label="비밀번호 재설정" onClick={resetPw}/>
        </>
      )}
      <p className="text-center text-xs text-[#6B7A99] mt-6">
        <button onClick={()=>goTo("login")} className="hover:text-[#2263EC]">로그인으로 돌아가기</button>
      </p>
    </AuthShell>
  );
}

/* ═══ MY ═══ */
const DIARY=[
  {id:1,popup:"NewJeans × Musinsa",date:"2025.07.02",area:"성수",imgId:"1558618666-fcd25c85cd64",rating:5,mood:"😍",
    note:"오전 10시에 갔는데도 30분 대기했어요. 한정판 파우치 득템! 포토부스 퀄리티 미쳤고, 공간 자체가 정말 잘 꾸며져 있었어요. 다음에 또 오고 싶다 ☺"},
  {id:2,popup:"Gentle Monster DREAM FACTORY",date:"2025.07.06",area:"홍대",imgId:"1441986300917-64674bd600d8",rating:4,mood:"🤩",
    note:"아트 설치물이 진짜 감각적이었어요. 아이웨어 피팅도 해보고 마음에 드는 프레임 장만했어요. 혼잡하긴 했지만 충분히 즐길 수 있었어요."},
];

function MyPage({ liked, user, onLogout, onDeleteAccount, reservations }:{
  liked:Set<number>; user:UserAccount; onLogout:()=>void; onDeleteAccount:()=>void; reservations:Reservation[];
}) {
  const [tab,setTab]=useState<MyTab>("찜한 팝업");
  const [showDeleteConfirm,setShowDeleteConfirm]=useState(false);
  const tabs:MyTab[]=["찜한 팝업","캘린더","예약 내역","다녀온 팝업","팝업 노트"];
  const likedPopups=ALL_POPUPS.filter(p=>liked.has(p.id));
  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
      <div className="rounded-xl p-5 mb-3 flex items-center gap-4"
        style={{background:"linear-gradient(135deg,#2263EC 0%,#4F8EF7 100%)",boxShadow:"0 8px 32px rgba(34,99,236,0.25)"}}>
        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
          style={{boxShadow:"0 4px 16px rgba(0,0,0,0.2)",border:"2px solid rgba(255,255,255,0.5)"}}>
          <img src={imgUrl("1494790108377-be9c29b29330",128,128)} alt="프로필" className="w-full h-full object-cover"/>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-extrabold text-white truncate">{user.name}</h1>
          <p className="text-white/70 text-sm truncate">{user.email}</p>
        </div>
        <div className="flex gap-6 text-center">
          {[{label:"찜",val:liked.size},{label:"방문",val:14},{label:"노트",val:8}].map(s=>(
            <div key={s.label}>
              <p className="text-2xl font-extrabold text-white">{s.val}</p>
              <p className="text-xs text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 mb-6">
        <button onClick={onLogout} className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7A99] hover:text-[#2263EC] transition-colors">
          <LogOut size={13}/> 로그아웃
        </button>
        <button onClick={()=>setShowDeleteConfirm(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7A99] hover:text-red-500 transition-colors">
          <Trash2 size={13}/> 회원 탈퇴
        </button>
      </div>
      {showDeleteConfirm&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{background:"rgba(10,22,40,0.45)"}}>
          <motion.div initial={{opacity:0,y:12,scale:0.97}} animate={{opacity:1,y:0,scale:1}}
            className="w-full max-w-sm bg-white rounded-xl p-6" style={{boxShadow:"0 16px 60px rgba(0,0,0,0.25)"}}>
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{background:"#FEF2F2"}}>
              <AlertTriangle size={22} color="#EF4444"/>
            </div>
            <h3 className="text-lg font-extrabold text-[#0A1628] mb-2">정말 탈퇴하시겠어요?</h3>
            <p className="text-sm text-[#6B7A99] mb-6">찜 목록, 방문 기록, 팝업 노트 등 모든 개인 데이터가 삭제되며 복구할 수 없어요.</p>
            <div className="flex gap-2">
              <button onClick={()=>setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl text-sm font-bold" style={{background:"#F0F4FF",color:"#0A1628"}}>취소</button>
              <button onClick={()=>{ setShowDeleteConfirm(false); onDeleteAccount(); }}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white" style={{background:"#EF4444"}}>탈퇴하기</button>
            </div>
          </motion.div>
        </div>
      )}
      <div className="flex bg-white rounded-xl p-1 mb-6"
        style={{boxShadow:"0 2px 12px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all"
            style={tab===t?{background:"#2263EC",color:"#fff",boxShadow:"0 2px 10px rgba(34,99,236,0.3)"}:{color:"#6B7A99"}}>
            {t}
          </button>
        ))}
      </div>
      {tab==="찜한 팝업"&&(
        likedPopups.length===0?(
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{background:"#E8F1FF"}}>
              <Heart size={28} color="#2263EC"/>
            </div>
            <p className="text-[#6B7A99] mt-2 font-medium">아직 찜한 팝업이 없어요</p>
          </div>
        ):(
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {likedPopups.map(p=>(
              <div key={p.id} className="rounded-xl overflow-hidden bg-white"
                style={{boxShadow:"0 2px 16px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
                <div className="relative h-40">
                  <img src={imgUrl(p.imgId)} alt={p.name} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
                  <div className="absolute bottom-2 left-2"><CongestionBadge level={p.congestion}/></div>
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm text-[#0A1628]">{p.name}</p>
                  <p className="text-xs text-[#6B7A99]">{p.area} · {p.startDate}–{p.endDate}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
      {tab==="캘린더"&&<CalendarPage/>}
      {tab==="다녀온 팝업"&&(
        <div className="flex flex-col gap-4">
          {ALL_POPUPS.slice(0,3).map((p,i)=>(
            <div key={p.id} className="flex gap-4 p-4 bg-white rounded-xl"
              style={{boxShadow:"0 2px 16px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
              <img src={imgUrl(p.imgId,200,200)} alt={p.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0"/>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-[#0A1628]">{p.name}</p>
                    <p className="text-xs text-[#6B7A99]">{p.area} · 방문 2025.07.0{i+1}</p>
                  </div>
                  <div className="flex">{Array.from({length:5}).map((_,j)=><Star key={j} size={13} fill={j<4?"#F59E0B":"none"} color="#F59E0B"/>)}</div>
                </div>
                <p className="text-xs text-[#6B7A99] mt-2 line-clamp-2">{p.description}</p>
                <div className="flex gap-3 mt-2">
                  <button className="text-xs text-[#2263EC] font-semibold flex items-center gap-1"><Camera size={11}/> 사진 추가</button>
                  <button className="text-xs text-[#6B7A99] flex items-center gap-1"><BookOpen size={11}/> 노트 작성</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="팝업 노트"&&(
        <div className="flex flex-col gap-6">
          <button className="flex items-center gap-2 text-sm font-bold text-[#2263EC] py-3 px-4 rounded-xl"
            style={{border:"1.5px dashed rgba(34,99,236,0.3)",background:"#F7F9FF"}}>
            <PlusCircle size={16}/> 새 노트 작성
          </button>
          {DIARY.map(d=>(
            <div key={d.id} className="bg-white rounded-xl overflow-hidden"
              style={{boxShadow:"0 4px 24px rgba(34,99,236,0.08)",border:"1px solid rgba(34,99,236,0.08)"}}>
              <div className="relative h-52">
                <img src={imgUrl(d.imgId,800,400)} alt={d.popup} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-white font-extrabold text-xl">{d.popup}</p>
                    <p className="text-white/60 text-xs">{d.date} · {d.area}</p>
                  </div>
                  <span className="text-3xl">{d.mood}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex mb-2">{Array.from({length:5}).map((_,i)=><Star key={i} size={14} fill={i<d.rating?"#F59E0B":"none"} color="#F59E0B"/>)}</div>
                <p className="text-sm text-[#0A1628] leading-relaxed">{d.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="예약 내역"&&(
        reservations.length===0?(
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{background:"#E8F1FF"}}>
              <CheckCircle size={28} color="#2263EC"/>
            </div>
            <p className="text-[#6B7A99] mt-2 font-medium">아직 예약한 팝업이 없어요</p>
          </div>
        ):(
          <div className="flex flex-col gap-3">
            {reservations.map(r=>{
              const p=ALL_POPUPS.find(x=>x.id===r.popupId);
              if(!p) return null;
              return (
                <div key={r.id} className="bg-white rounded-xl p-4 flex items-center gap-4"
                  style={{boxShadow:"0 2px 16px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
                  <img src={imgUrl(p.imgId,160,160)} alt={p.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-[#0A1628] truncate">{p.name}</p>
                    <p className="text-xs text-[#6B7A99] flex items-center gap-1 mt-0.5"><MapPin size={10}/> {p.area} · {r.slot}</p>
                    <p className="text-[10px] text-[#6B7A99] mt-1">예약번호 CP-{String(r.id).slice(-4).padStart(4,"0")}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                    style={r.status==="완료"?{background:"#ECFDF5",color:"#10B981"}:{background:"#E8F1FF",color:"#2263EC"}}>
                    {r.status==="완료"?"이용 완료":"예약 예정"}
                  </span>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

/* ═══ COMMUNITY ═══ */
const REVIEWS=[
  {id:1,user:"팝업덕후_이수현",avatar:"1494790108377-be9c29b29330",popup:"NewJeans × Musinsa",area:"성수",date:"2025.07.03",rating:5,
    imgId:"1558618666-fcd25c85cd64",likes:247,comments:32,
    text:"기다린 보람이 있었어요! 한정판 굿즈 다 득템했고 포토부스 퀄리티 미쳤어요. 뉴진스 팬이라면 무조건 방문하세요 🩷",
    aiSummary:"대기 가치 ✓ · 굿즈 만족도 높음 · 포토부스 인기"},
  {id:2,user:"스니커헤드_박준혁",avatar:"1507003211169-0a1dd7228f2d",popup:"Nike Jordan Brand Seoul",area:"잠실",date:"2025.07.02",rating:4,
    imgId:"1542291026-7eec264c27ff",likes:189,comments:28,
    text:"조던 팬으로서 너무 소중한 경험이었어요. 레어템 전시는 눈이 즐거웠고 전시 자체 퀄리티 최상!",
    aiSummary:"한정판 경쟁 치열 · 전시 퀄리티 높음 · 일찍 방문 권장"},
];
interface Companion {
  id:number; user:string; popup:string; date:string; time:string; area:string;
  people:string; desc:string; applies:number; comments:{user:string;text:string}[];
}
const COMPANIONS:Companion[]=[
  {id:1,user:"팝업탐험가_최지원",popup:"aespa × Adobe 'AI WORLD'",date:"07.12(토)",time:"오후 2시",area:"강남",people:"1명 구해요",
    desc:"어도비 AI 아트 팝업 같이 가실 분! 테크·아트 좋아하는 분이면 더 좋아요 😊",applies:3,
    comments:[{user:"테크러버_정유진",text:"저 갈래요! 오후 2시 좋습니다 🙋"}]},
  {id:2,user:"뉴진스팬_한소희",popup:"NewJeans × Musinsa",date:"07.08(화)",time:"오전 10시",area:"성수",people:"2명 구해요",
    desc:"뉴진스 팝업 오전 10시 오픈런! 굿즈 같이 줄 서실 분들 구해요 🩷",applies:7,comments:[]},
];
const COMPANION_PEOPLE_OPTS=["1명 구해요","2명 구해요","3명 이상"];

function CompanionWriteForm({ onSubmit, onCancel }:{ onSubmit:(c:Omit<Companion,"id"|"applies"|"comments">)=>void; onCancel:()=>void }) {
  const [popup,setPopup]=useState(ALL_POPUPS[0].name);
  const [area,setArea]=useState(ALL_POPUPS[0].area);
  const [date,setDate]=useState("");
  const [time,setTime]=useState("");
  const [people,setPeople]=useState(COMPANION_PEOPLE_OPTS[0]);
  const [desc,setDesc]=useState("");

  function submit(){
    if(!date.trim()||!time.trim()||!desc.trim()) return;
    onSubmit({user:"나",popup,area,date,time,people,desc});
  }

  return (
    <div className="bg-white rounded-xl p-5 mb-5" style={{border:"1.5px solid rgba(34,99,236,0.15)"}}>
      <h3 className="font-bold text-[#0A1628] mb-4">동행 모집 글쓰기</h3>
      <p className="text-xs text-[#6B7A99] font-semibold mb-1.5">팝업 선택</p>
      <select value={popup} onChange={e=>{
          setPopup(e.target.value);
          const found=ALL_POPUPS.find(x=>x.name===e.target.value);
          if(found) setArea(found.area);
        }}
        className="w-full mb-3 rounded-xl px-3 py-2.5 text-sm outline-none" style={{background:"#F7F9FF",border:"1px solid rgba(34,99,236,0.12)"}}>
        {ALL_POPUPS.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
      </select>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input value={date} onChange={e=>setDate(e.target.value)} placeholder="날짜 (예: 07.15(화))"
          className="rounded-xl px-3 py-2.5 text-sm outline-none" style={{background:"#F7F9FF",border:"1px solid rgba(34,99,236,0.12)"}}/>
        <input value={time} onChange={e=>setTime(e.target.value)} placeholder="시간 (예: 오후 2시)"
          className="rounded-xl px-3 py-2.5 text-sm outline-none" style={{background:"#F7F9FF",border:"1px solid rgba(34,99,236,0.12)"}}/>
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {COMPANION_PEOPLE_OPTS.map(p=>(
          <button key={p} onClick={()=>setPeople(p)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={people===p?{background:"#2263EC",color:"#fff"}:{background:"#E8F1FF",color:"#2263EC"}}>{p}</button>
        ))}
      </div>
      <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="동행 모집 내용을 적어주세요..."
        className="w-full rounded-xl p-3 text-sm outline-none resize-none mb-4" rows={3}
        style={{background:"#F7F9FF",border:"1px solid rgba(34,99,236,0.12)"}}/>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{background:"#F0F4FF",color:"#0A1628"}}>취소</button>
        <button onClick={submit} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{background:"#2263EC"}}>등록하기</button>
      </div>
    </div>
  );
}

function CompanionCard({ c, onApply }:{ c:Companion; onApply:(id:number,comment:string)=>void }) {
  const [open,setOpen]=useState(false);
  const [comment,setComment]=useState("");
  const [applied,setApplied]=useState(false);

  function submit(){
    if(!comment.trim()) return;
    onApply(c.id,comment);
    setComment(""); setApplied(true);
  }

  return (
    <div className="bg-white rounded-xl p-5" style={{boxShadow:"0 4px 24px rgba(34,99,236,0.08)",border:"1px solid rgba(34,99,236,0.08)"}}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background:"#E8F1FF",color:"#2263EC"}}>{c.people}</span>
            <span className="text-xs text-[#6B7A99]">{c.date} {c.time}</span>
          </div>
          <h3 className="font-extrabold text-base text-[#0A1628]">{c.popup}</h3>
          <p className="text-xs text-[#6B7A99] flex items-center gap-1 mt-0.5"><MapPin size={10}/> {c.area}</p>
        </div>
        <span className="text-xs text-[#6B7A99] font-medium px-2.5 py-1 rounded-full" style={{background:"#F7F9FF"}}>{c.applies}명 신청</span>
      </div>
      <p className="text-sm text-[#0A1628] mb-4">{c.desc}</p>
      <div className="flex gap-2">
        <button onClick={()=>setOpen(true)} disabled={applied}
          className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60"
          style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:"0 4px 12px rgba(34,99,236,0.3)"}}>
          {applied?"신청 완료":"동행 신청하기"}
        </button>
        <button onClick={()=>setOpen(!open)} className="py-2.5 px-4 rounded-xl text-sm" style={{background:"#E8F1FF",color:"#2263EC"}}>
          <MessageCircle size={15}/>
        </button>
      </div>
      {open&&(
        <div className="mt-3 pt-3" style={{borderTop:"1px solid rgba(34,99,236,0.08)"}}>
          {c.comments.length>0&&(
            <div className="flex flex-col gap-2 mb-3">
              {c.comments.map((cm,i)=>(
                <div key={i} className="text-xs rounded-xl px-3 py-2" style={{background:"#F7F9FF"}}>
                  <span className="font-bold text-[#0A1628]">{cm.user}</span> <span className="text-[#0A1628]">{cm.text}</span>
                </div>
              ))}
            </div>
          )}
          {!applied&&(
            <div className="flex gap-2">
              <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
                placeholder="댓글로 동행 신청 의사를 남겨주세요"
                className="flex-1 rounded-xl px-3 py-2 text-xs outline-none" style={{background:"#F7F9FF",border:"1px solid rgba(34,99,236,0.1)"}}/>
              <button onClick={submit} className="px-3.5 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0" style={{background:"#2263EC"}}>등록</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CommunityPage() {
  const [tab,setTab]=useState<CommTab>("후기");
  const [companions,setCompanions]=useState<Companion[]>(COMPANIONS);
  const [showWriteForm,setShowWriteForm]=useState(false);
  const [showFilter,setShowFilter]=useState(false);
  const [filterArea,setFilterArea]=useState("전체");
  const [filterPopup,setFilterPopup]=useState("전체");
  const [filterDate,setFilterDate]=useState("전체");

  const companionAreas=["전체",...Array.from(new Set(companions.map(c=>c.area)))];
  const companionPopups=["전체",...Array.from(new Set(companions.map(c=>c.popup)))];
  const companionDates=["전체",...Array.from(new Set(companions.map(c=>c.date)))];
  const filteredCompanions=companions.filter(c=>
    (filterArea==="전체"||c.area===filterArea)&&(filterPopup==="전체"||c.popup===filterPopup)&&(filterDate==="전체"||c.date===filterDate));

  function addCompanion(c:Omit<Companion,"id"|"applies"|"comments">){
    setCompanions(prev=>[{...c,id:Date.now(),applies:0,comments:[]},...prev]);
    setShowWriteForm(false);
  }
  function applyToCompanion(id:number,comment:string){
    setCompanions(prev=>prev.map(c=>c.id===id?{...c,applies:c.applies+1,comments:[...c.comments,{user:"나",text:comment}]}:c));
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-8 pb-20">
      <h1 className="text-3xl font-extrabold text-[#0A1628] mb-2">후기 <span style={{color:"#2263EC"}}>커뮤니티</span></h1>
      <p className="text-sm text-[#6B7A99] mb-6">다녀온 팝업의 생생한 후기를 공유해요</p>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex bg-white rounded-xl p-1" style={{boxShadow:"0 2px 12px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
          {(["후기","동행 모집"] as CommTab[]).map(t=>(
            <button key={t} onClick={()=>{setTab(t);setShowWriteForm(false);}} className="px-5 py-2 text-sm font-bold rounded-xl transition-all"
              style={tab===t?{background:"#2263EC",color:"#fff",boxShadow:"0 2px 10px rgba(34,99,236,0.3)"}:{color:"#6B7A99"}}>
              {t}
            </button>
          ))}
        </div>
        {tab==="동행 모집"&&(
          <button onClick={()=>setShowFilter(!showFilter)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={showFilter?{background:"#2263EC",color:"#fff"}:{background:"#fff",color:"#2263EC",border:"1.5px solid rgba(34,99,236,0.2)"}}>
            <Filter size={13}/> 필터
          </button>
        )}
        <button onClick={()=>tab==="동행 모집"&&setShowWriteForm(!showWriteForm)}
          className="ml-auto flex items-center gap-2 text-white text-xs font-bold px-4 py-2.5 rounded-xl"
          style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:"0 4px 12px rgba(34,99,236,0.35)"}}>
          <PlusCircle size={14}/> {tab==="후기"?"후기 작성":"동행 모집 글쓰기"}
        </button>
      </div>
      {tab==="동행 모집"&&showFilter&&(
        <div className="mb-5 p-5 bg-white rounded-xl" style={{border:"1.5px solid rgba(34,99,236,0.1)",boxShadow:"0 4px 20px rgba(34,99,236,0.06)"}}>
          <div className="mb-4">
            <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide mb-2">지역</p>
            <div className="flex flex-wrap gap-2">
              {companionAreas.map(a=>(
                <button key={a} onClick={()=>setFilterArea(a)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={filterArea===a?{background:"#2263EC",color:"#fff"}:{background:"#E8F1FF",color:"#2263EC"}}>{a}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide mb-2">팝업</p>
            <div className="flex flex-wrap gap-2">
              {companionPopups.map(p=>(
                <button key={p} onClick={()=>setFilterPopup(p)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={filterPopup===p?{background:"#2263EC",color:"#fff"}:{background:"#E8F1FF",color:"#2263EC"}}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-[#6B7A99] font-semibold uppercase tracking-wide mb-2">날짜</p>
            <div className="flex flex-wrap gap-2">
              {companionDates.map(d=>(
                <button key={d} onClick={()=>setFilterDate(d)} className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={filterDate===d?{background:"#2263EC",color:"#fff"}:{background:"#E8F1FF",color:"#2263EC"}}>{d}</button>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==="동행 모집"&&showWriteForm&&(
        <CompanionWriteForm onSubmit={addCompanion} onCancel={()=>setShowWriteForm(false)}/>
      )}
      {tab==="후기"&&(
        <div className="flex flex-col gap-5">
          {REVIEWS.map(r=>(
            <div key={r.id} className="bg-white rounded-xl overflow-hidden"
              style={{boxShadow:"0 4px 24px rgba(34,99,236,0.08)",border:"1px solid rgba(34,99,236,0.08)"}}>
              <div className="relative h-52">
                <img src={imgUrl(r.imgId,800,400)} alt={r.popup} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/>
                <div className="absolute bottom-3 left-4">
                  <p className="text-white font-extrabold text-xl">{r.popup}</p>
                  <p className="text-white/60 text-xs">{r.area} · {r.date}</p>
                </div>
                <div className="absolute top-3 right-3 rounded-xl px-3 py-2"
                  style={{background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",boxShadow:"0 2px 12px rgba(0,0,0,0.1)"}}>
                  <p className="text-[10px] text-[#2263EC] font-bold flex items-center gap-1 mb-0.5"><Sparkles size={10}/> AI 요약</p>
                  <p className="text-[10px] text-[#0A1628] font-medium">{r.aiSummary}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img src={`https://images.unsplash.com/photo-${r.avatar}?w=64&h=64&fit=crop`} alt={r.user} className="w-9 h-9 rounded-full object-cover"/>
                  <div>
                    <p className="text-sm font-bold text-[#0A1628]">{r.user}</p>
                    <div className="flex">{Array.from({length:5}).map((_,i)=><Star key={i} size={11} fill={i<r.rating?"#F59E0B":"none"} color="#F59E0B"/>)}</div>
                  </div>
                </div>
                <p className="text-sm text-[#0A1628] leading-relaxed">{r.text}</p>
                <div className="flex items-center gap-4 mt-4 pt-3" style={{borderTop:"1px solid rgba(34,99,236,0.07)"}}>
                  <button className="flex items-center gap-1.5 text-xs text-[#6B7A99] hover:text-red-400 transition-colors"><Heart size={13}/> {r.likes}</button>
                  <button className="flex items-center gap-1.5 text-xs text-[#6B7A99] hover:text-[#2263EC] transition-colors"><MessageCircle size={13}/> {r.comments}</button>
                  <button className="flex items-center gap-1.5 text-xs text-[#2263EC] font-semibold ml-auto"><Camera size={13}/> 인증사진 보기</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="동행 모집"&&(
        <div className="flex flex-col gap-4">
          {filteredCompanions.map(c=><CompanionCard key={c.id} c={c} onApply={applyToCompanion}/>)}
          {filteredCompanions.length===0&&(
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{background:"#E8F1FF"}}>
                <Users size={28} color="#2263EC"/>
              </div>
              <p className="text-[#6B7A99] font-medium">조건에 맞는 동행 모집 글이 없어요</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══ RESERVATION ═══ */
const RESERVE_SLOTS=["오전 10시","오후 12시","오후 2시","오후 4시","오후 6시"];

function ReservationCard({ p, reservation, onReserve }:{ p:Popup; reservation?:Reservation; onReserve:(popupId:number,slot:string)=>void }) {
  const [showSlots,setShowSlots]=useState(false);
  const [slot,setSlot]=useState("");
  const reserved=!!reservation;

  function confirm(){
    if(!slot) return;
    onReserve(p.id,slot); setShowSlots(false);
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col" style={{boxShadow:"0 2px 16px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
      <div className="relative" style={{height:140}}>
        <img src={imgUrl(p.imgId,400,280)} alt={p.name} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"/>
        <div className="absolute bottom-2 left-2"><CongestionBadge level={p.congestion}/></div>
      </div>
      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-[11px] text-[#6B7A99] font-medium mb-0.5">{p.brand}</p>
        <h3 className="text-sm font-bold text-[#0A1628] leading-snug truncate">{p.name}</h3>
        <div className="flex items-center gap-3 text-[11px] text-[#6B7A99] mt-1.5">
          <span className="flex items-center gap-1"><MapPin size={10}/> {p.area}</span>
          <span className="flex items-center gap-1"><CalendarDays size={10}/> {p.startDate}–{p.endDate}</span>
        </div>

        {reserved?(
          <span className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold px-3 py-2.5 rounded-xl" style={{background:"#ECFDF5",color:"#10B981"}}>
            <CheckCircle size={12}/> 예약 완료
          </span>
        ):showSlots?(
          <div className="mt-3">
            <p className="text-[11px] text-[#6B7A99] font-semibold mb-1.5">방문 시간 선택</p>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {RESERVE_SLOTS.map(s=>(
                <button key={s} onClick={()=>setSlot(s)} className="px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-all"
                  style={slot===s?{background:"#2263EC",color:"#fff"}:{background:"#E8F1FF",color:"#2263EC"}}>{s}</button>
              ))}
            </div>
            <div className="flex gap-1.5">
              <button onClick={()=>setShowSlots(false)} className="flex-1 py-2 rounded-lg text-xs font-bold" style={{background:"#F0F4FF",color:"#0A1628"}}>취소</button>
              <button onClick={confirm} disabled={!slot}
                className="flex-1 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50" style={{background:"#2263EC"}}>확정</button>
            </div>
          </div>
        ):(
          <button onClick={()=>setShowSlots(true)}
            className="mt-3 flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2.5 rounded-xl"
            style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:"0 4px 12px rgba(34,99,236,0.35)"}}>
            <CheckCircle size={12}/> 지금 예약하기
          </button>
        )}
        {reservation&&(
          <p className="mt-2 text-[10px] text-[#6B7A99] text-center">{reservation.slot} · CP-{String(reservation.id).slice(-4).padStart(4,"0")}</p>
        )}
      </div>
    </div>
  );
}

/* ═══ POPUP DETAIL ═══ */
const GALLERY_CROPS=[{w:900,h:560},{w:900,h:900},{w:1000,h:640}];
const DETAIL_IMG_CROPS=[{w:800,h:1000},{w:800,h:1000}];

function benefitText(p:Popup){
  return `SNS 댓글 이벤트 참여 시, 추첨을 통해 ${p.brand} 굿즈를 선물로 드려요 🎁`;
}
function marketingCopy(p:Popup){
  return [
    `내 마음대로 골라 담았는데, 이 정도 구성이라고요? 😍`,
    `${p.brand} ${p.area} 플래그십 스토어에서 준비한 ${p.category} 스페셜 프로모션을 만나보세요!`,
  ];
}
function buildAiMate(p:Popup){
  return {
    whatToDo:[
      `${p.brand}의 감각적인 ${p.category} 공간에서 특별한 굿즈와 체험을 만나볼 수 있어요.`,
      p.reservationType==="사전 예약"?`사전 예약 후 방문하면 대기 없이 바로 입장할 수 있어요.`:
      p.reservationType==="선착순"?`선착순 운영이라 방문 전 대기 상황을 꼭 확인하는 게 좋아요.`:
      `무료 입장이라 부담 없이 들러볼 수 있어요.`,
    ],
    whoFor:[
      `${p.category}에 관심 많은 분들에게 딱이에요.`,
      `${p.area} 근처에서 가볍게 들르기 좋은 코스를 찾는 분께 추천해요.`,
    ],
    reviews:[
      `방문자들은 "${p.bestTime} 방문 시 대기가 가장 짧았다"는 후기를 많이 남겼어요.`,
      `공간 구성과 포토스팟 만족도가 높은 편이에요 (리뷰 ${p.reviews}건 · 좋아요 ${p.likes.toLocaleString()}개).`,
    ],
    access:[
      `${p.location}에 위치해 있어요.`,
      `${p.area} 인근이라 대중교통으로 접근하기 편해요.`,
    ],
  };
}
const STATUS_BADGE_STYLE:Record<string,{bg:string;color:string}>={
  "오픈예정":{bg:"#FFF7ED",color:"#F97316"}, "운영중":{bg:"#E8F1FF",color:"#2263EC"},
  "종료임박":{bg:"#FEF2F2",color:"#EF4444"}, "종료":{bg:"#F0F4FF",color:"#6B7A99"},
};

function MiniMap({ area }:{ area:string }) {
  const pos=MAP_AREA_POS[area]||{x:50,y:50};
  return (
    <div className="relative rounded-xl overflow-hidden mt-1" style={{height:140,background:"linear-gradient(160deg,#EAF1FE 0%,#F5F8FF 100%)",border:"1px solid rgba(34,99,236,0.1)"}}>
      <div className="absolute inset-0 opacity-60" style={{backgroundImage:"linear-gradient(rgba(34,99,236,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(34,99,236,0.08) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
      <div className="absolute flex flex-col items-center" style={{left:`${pos.x}%`,top:`${pos.y}%`,transform:"translate(-50%,-100%)"}}>
        <span className="text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap mb-1" style={{background:"#2263EC",boxShadow:"0 2px 8px rgba(0,0,0,0.2)"}}>{area}</span>
        <MapPin size={22} color="#2263EC" fill="#2263EC" fillOpacity={0.18}/>
      </div>
    </div>
  );
}

function RelatedPopupCard({ p, onOpenDetail }:{ p:Popup; onOpenDetail:(id:number)=>void }) {
  return (
    <button onClick={()=>onOpenDetail(p.id)} className="flex-shrink-0 w-40 rounded-xl overflow-hidden bg-white text-left"
      style={{border:"1px solid rgba(34,99,236,0.08)",boxShadow:"0 2px 12px rgba(34,99,236,0.06)"}}>
      <div className="relative h-24">
        <img src={imgUrl(p.imgId,300,200)} alt={p.name} className="w-full h-full object-cover"/>
        <div className="absolute bottom-1.5 left-1.5"><CongestionBadge level={p.congestion}/></div>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-bold text-[#0A1628] leading-tight line-clamp-2">{p.name}</p>
        <p className="text-[10px] text-[#6B7A99] mt-1">{p.area}</p>
      </div>
    </button>
  );
}

function PopupDetailPage({ popup, liked, onToggleLike, onBack, reservation, onReserve, onOpenDetail }:{
  popup:Popup; liked:boolean; onToggleLike:(id:number)=>void; onBack:()=>void;
  reservation?:Reservation; onReserve:(popupId:number,slot:string)=>void; onOpenDetail:(id:number)=>void;
}) {
  const [tab,setTab]=useState<"정보"|"리뷰">("정보");
  const [galleryIdx,setGalleryIdx]=useState(0);
  const [showMap,setShowMap]=useState(false);

  const [showReviewForm,setShowReviewForm]=useState(false);
  const [reviewText,setReviewText]=useState("");
  const [reviewRating,setReviewRating]=useState(5);
  const [reviewPhoto,setReviewPhoto]=useState(false);
  const [myReviews,setMyReviews]=useState<{rating:number;text:string;hasPhoto:boolean}[]>([]);

  const [showReserve,setShowReserve]=useState(false);
  const [reserveSlot,setReserveSlot]=useState("");
  const [aiMateOpen,setAiMateOpen]=useState(true);
  const [reported,setReported]=useState(false);

  const reviews = REVIEWS.filter(r=>r.popup===popup.name);
  const totalReviews = reviews.length+myReviews.length;
  const slots=["오전 10시","오후 12시","오후 2시","오후 4시","오후 6시"];
  const aiMate = buildAiMate(popup);
  const keywords = Array.from(new Set([popup.area,`${popup.area} 팝업`,popup.brand,popup.category,`${popup.category} 팝업스토어`,`${popup.area} 데이트`]));
  const status = popupStatusOnDay(popup,5);
  const statusStyle = STATUS_BADGE_STYLE[status];
  const related = ALL_POPUPS.filter(p=>p.id!==popup.id&&(p.area===popup.area||p.category===popup.category)).slice(0,5);

  function submitReview(){
    if(!reviewText.trim()) return;
    setMyReviews(p=>[{rating:reviewRating,text:reviewText,hasPhoto:reviewPhoto},...p]);
    setReviewText(""); setReviewPhoto(false); setReviewRating(5); setShowReviewForm(false);
  }
  function submitReserve(){
    if(!reserveSlot) return;
    onReserve(popup.id,reserveSlot); setShowReserve(false);
  }
  function share(){
    const text=`${popup.name} · 찰리의 팝업 공장`;
    if(navigator.share) navigator.share({title:popup.name,text}).catch(()=>{});
    else if(navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{});
  }

  return (
    <div className="max-w-6xl mx-auto pb-28">
      <div className="px-6 pt-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-semibold text-[#6B7A99] mb-4 hover:text-[#2263EC] transition-colors">
          <ChevronRight size={14} style={{transform:"rotate(180deg)"}}/> 목록으로
        </button>
      </div>

      {/* 갤러리 */}
      <div className="px-6">
        <div className="relative rounded-xl overflow-hidden" style={{height:320}}>
          <img src={imgUrl(popup.imgId,GALLERY_CROPS[galleryIdx].w,GALLERY_CROPS[galleryIdx].h)} alt={popup.name} className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"/>
          {popup.isHot&&(
            <div className="absolute top-4 left-4 flex items-center gap-1 text-white text-xs font-bold px-3 py-1.5 rounded-full"
              style={{background:"#2263EC",boxShadow:"0 2px 8px rgba(34,99,236,0.4)"}}>
              <TrendingUp size={11}/> HOT
            </div>
          )}
          <button onClick={()=>setGalleryIdx(i=>(i-1+GALLERY_CROPS.length)%GALLERY_CROPS.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(6px)"}}>
            <ChevronRight size={15} color="#0A1628" style={{transform:"rotate(180deg)"}}/>
          </button>
          <button onClick={()=>setGalleryIdx(i=>(i+1)%GALLERY_CROPS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{background:"rgba(255,255,255,0.85)",backdropFilter:"blur(6px)"}}>
            <ChevronRight size={15} color="#0A1628"/>
          </button>
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
            {GALLERY_CROPS.map((_,i)=>(
              <span key={i} className="rounded-full transition-all" style={i===galleryIdx?{width:14,height:5,background:"#fff"}:{width:5,height:5,background:"rgba(255,255,255,0.5)"}}/>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pt-4">
        {/* 상태 배지 줄 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background:statusStyle.bg,color:statusStyle.color}}>{status}</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{background:"#F0F4FF",color:"#6B7A99"}}>{popup.category}</span>
          <span className="ml-auto flex items-center gap-1 text-xs text-[#6B7A99] font-medium">
            <Heart size={12} fill="#EF4444" color="#EF4444"/> {popup.likes.toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-[#6B7A99] font-medium mb-1">{popup.brand}</p>
        <h1 className="text-2xl font-extrabold text-[#0A1628] mb-3">{popup.name}</h1>

        {/* 일정 · 위치 */}
        <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{background:"#F7F9FF",border:"1px solid rgba(34,99,236,0.08)"}}>
          <div className="flex items-center gap-2 text-sm text-[#0A1628]">
            <CalendarDays size={14} color="#2263EC" className="flex-shrink-0"/>
            {popup.startDate} – {popup.endDate} · <span className="text-[#2263EC] font-semibold">{popup.bestTime}</span> 추천
          </div>
          <div className="flex items-center gap-2 text-sm text-[#0A1628]">
            <MapPin size={14} color="#2263EC" className="flex-shrink-0"/>
            <span className="flex-1">{popup.location}</span>
            <button onClick={()=>setShowMap(!showMap)} className="text-xs font-bold text-[#2263EC] flex-shrink-0">{showMap?"지도 닫기":"지도 보기"}</button>
          </div>
          {showMap&&<MiniMap area={popup.area}/>}
        </div>

        {/* 탭 */}
        <div className="flex items-center gap-1 mt-6" style={{borderBottom:"1.5px solid rgba(34,99,236,0.1)"}}>
          {(["정보","리뷰"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className="relative px-4 py-3 text-sm font-bold" style={{color:tab===t?"#2263EC":"#6B7A99"}}>
              {t==="정보"?"팝업 정보":`리뷰${totalReviews>0?` (${totalReviews})`:""}`}
              {tab===t&&<div className="absolute bottom-[-1.5px] left-0 right-0 h-[2px]" style={{background:"#2263EC"}}/>}
            </button>
          ))}
        </div>

        {tab==="정보"&&(
          <div className="pt-5 flex flex-col gap-5">
            {/* 혜택 */}
            <div>
              <h2 className="font-bold text-[#0A1628] text-sm mb-3">혜택</h2>
              <div className="flex gap-2 mb-3">
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:"#0A1628",color:"#fff"}}>SNS 인증</span>
                <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{background:"#F0F4FF",color:"#0A1628",border:"1px solid rgba(10,22,40,0.1)"}}>구매 고객</span>
              </div>
              <div className="flex items-start gap-2 rounded-xl px-4 py-3" style={{background:"#F7F9FF"}}>
                <Camera size={14} color="#2263EC" className="flex-shrink-0 mt-0.5"/>
                <p className="text-sm text-[#0A1628]">{benefitText(popup)}</p>
              </div>
            </div>

            {/* 정보 */}
            <div>
              <h2 className="font-bold text-[#0A1628] text-sm mb-3">정보</h2>
              <div className="flex flex-col gap-2 mb-4">
                {marketingCopy(popup).map((line,i)=><p key={i} className="text-sm text-[#0A1628] leading-relaxed">{line}</p>)}
              </div>
              <div className="rounded-xl p-4 flex flex-col gap-2" style={{background:"#F7F9FF",border:"1px solid rgba(34,99,236,0.08)"}}>
                <p className="text-xs text-[#0A1628] flex items-center gap-2"><Bell size={12} color="#2263EC" className="flex-shrink-0"/> SNS 이벤트 발표: {popup.endDate} 개별 DM 안내</p>
                <p className="text-xs text-[#0A1628] flex items-center gap-2"><Instagram size={12} color="#2263EC" className="flex-shrink-0"/> Instagram @{popup.brand}_공식</p>
              </div>
            </div>

            {/* AI 메이트 */}
            <div className="rounded-xl overflow-hidden" style={{border:"1.5px solid rgba(34,99,236,0.15)"}}>
              <div className="p-5" style={{background:"linear-gradient(145deg,#EBF2FF 0%,#F0F6FF 100%)"}}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon3D gradient="linear-gradient(145deg,#4F8EF7,#2263EC)" size={28}><Sparkles size={14} color="#fff"/></Icon3D>
                  <h2 className="font-bold text-[#0A1628] text-sm">AI 메이트</h2>
                  <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full flex-shrink-0" style={{background:"#2263EC"}}>포스터 파싱 기반</span>
                </div>
                <p className="text-[11px] text-[#6B7A99] ml-9">홍보 포스터 이미지를 AI가 분석해 자동으로 생성한 소개예요</p>
              </div>
              {aiMateOpen&&(
                <div className="p-5 flex flex-col gap-4 bg-white">
                  {[
                    {emoji:"🙋",title:"여기서 뭘 할 수 있나요?",items:aiMate.whatToDo},
                    {emoji:"🎯",title:"이런 분한테 딱이에요",items:aiMate.whoFor},
                    {emoji:"💬",title:"다녀온 분들의 리얼 후기",items:aiMate.reviews},
                    {emoji:"📍",title:"이렇게 찾아가요",items:aiMate.access},
                  ].map(sec=>(
                    <div key={sec.title}>
                      <p className="text-sm font-bold text-[#0A1628] mb-1.5">{sec.emoji} {sec.title}</p>
                      <ul className="flex flex-col gap-1">
                        {sec.items.map((it,i)=>(
                          <li key={i} className="text-xs text-[#6B7A99] leading-relaxed pl-3 relative">
                            <span className="absolute left-0">-</span>{it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={()=>setAiMateOpen(!aiMateOpen)}
                className="w-full py-3 text-xs font-bold flex items-center justify-center gap-1 bg-white"
                style={{color:"#2263EC",borderTop:"1px solid rgba(34,99,236,0.08)"}}>
                AI 분석 {aiMateOpen?"접기":"펼치기"}
                <ChevronRight size={12} style={{transform:aiMateOpen?"rotate(-90deg)":"rotate(90deg)"}}/>
              </button>
            </div>

            {/* 기본정보 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {icon:<CalendarDays size={14} color="#2263EC"/>, label:"운영기간", val:`${popup.startDate} – ${popup.endDate}`},
                {icon:<ShoppingBag size={14} color="#2263EC"/>, label:"브랜드", val:popup.brand},
                {icon:<Clock size={14} color="#2263EC"/>, label:"추천 방문", val:popup.bestTime},
              ].map(info=>(
                <div key={info.label} className="bg-white rounded-xl p-3.5" style={{border:"1px solid rgba(34,99,236,0.08)",boxShadow:"0 2px 12px rgba(34,99,236,0.06)"}}>
                  <div className="flex items-center gap-1.5 mb-1.5">{info.icon}<span className="text-[11px] text-[#6B7A99] font-semibold">{info.label}</span></div>
                  <p className="text-xs font-bold text-[#0A1628] leading-snug">{info.val}</p>
                </div>
              ))}
            </div>

            {/* 혼잡도 예측 */}
            <div className="bg-white rounded-xl p-5" style={{boxShadow:"0 2px 20px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
              <div className="flex items-center gap-3 mb-1">
                <Icon3D gradient="linear-gradient(145deg,#4F8EF7,#2263EC)" size={36}><TrendingUp size={16} color="#fff"/></Icon3D>
                <div>
                  <h2 className="font-bold text-[#0A1628] text-sm">AI 혼잡도 예측</h2>
                  <p className="text-[11px] text-[#6B7A99]">오늘 시간대별 예상 대기</p>
                </div>
                <span className="ml-auto"><CongestionBadge level={popup.congestion}/></span>
              </div>
              <div className="mt-4 flex items-end gap-1.5 h-20">
                {CONGESTION_HOURS.map((bar,i)=>{
                  const color=bar.v<40?"#10B981":bar.v<65?"#F59E0B":bar.v<85?"#F97316":"#EF4444";
                  return (
                    <div key={bar.t} className="flex flex-col items-center gap-1 flex-1">
                      <motion.div initial={{height:0}} animate={{height:`${bar.v}%`}} transition={{delay:i*0.03,duration:0.35}}
                        className="w-full rounded-t-lg" style={{backgroundColor:color,opacity:0.85,minHeight:4}}/>
                      <span className="text-[8px] text-[#6B7A99]">{bar.t}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-center gap-2 rounded-xl px-3.5 py-2" style={{background:"#E8F1FF"}}>
                <Sparkles size={13} color="#2263EC"/>
                <p className="text-xs text-[#2263EC] font-semibold">{popup.bestTime} 방문 시 대기 최소</p>
              </div>
            </div>

            {/* 자체 예약 */}
            <div className="bg-white rounded-xl p-5" style={{boxShadow:"0 2px 20px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
              <div className="flex items-center gap-3 mb-4">
                <Icon3D gradient="linear-gradient(145deg,#93C5FD,#3B82F6)" size={36}><CheckCircle size={16} color="#fff"/></Icon3D>
                <div>
                  <h2 className="font-bold text-[#0A1628] text-sm">예약하기</h2>
                  <p className="text-[11px] text-[#6B7A99]">찰리의 팝업 공장 자체 예약 시스템</p>
                </div>
              </div>
              {reservation?(
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{background:"#ECFDF5"}}>
                  <CheckCircle size={18} color="#10B981"/>
                  <div>
                    <p className="text-sm font-bold text-[#0A1628]">예약이 완료됐어요</p>
                    <p className="text-xs text-[#6B7A99]">{reservation.slot} · 예약번호 CP-{String(reservation.id).slice(-4).padStart(4,"0")}</p>
                  </div>
                </div>
              ):showReserve?(
                <div>
                  <p className="text-xs text-[#6B7A99] font-semibold mb-2">방문 시간 선택</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {slots.map(s=>(
                      <button key={s} onClick={()=>setReserveSlot(s)}
                        className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
                        style={reserveSlot===s?{background:"#2263EC",color:"#fff"}:{background:"#E8F1FF",color:"#2263EC"}}>{s}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>setShowReserve(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{background:"#F0F4FF",color:"#0A1628"}}>취소</button>
                    <PrimaryButton label="예약 확정" onClick={submitReserve} disabled={!reserveSlot}/>
                  </div>
                </div>
              ):(
                <button onClick={()=>setShowReserve(true)}
                  className="w-full py-3.5 rounded-xl text-white text-sm font-bold" style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:"0 4px 16px rgba(34,99,236,0.3)"}}>
                  지금 예약하기
                </button>
              )}
            </div>

            {/* 상세 이미지 */}
            <div>
              <h2 className="font-bold text-[#0A1628] text-sm mb-1">상세 이미지</h2>
              <p className="text-xs text-[#6B7A99] mb-3">이미지를 터치하면 확대해서 확인이 가능합니다</p>
              <div className="flex flex-col gap-3">
                {DETAIL_IMG_CROPS.map((c,i)=>(
                  <div key={i} className="rounded-xl overflow-hidden">
                    <img src={imgUrl(popup.imgId,c.w,c.h)} alt={`${popup.name} 상세 이미지 ${i+1}`} className="w-full object-cover"/>
                  </div>
                ))}
              </div>
            </div>

            {/* SNS / 홈페이지 */}
            <div>
              <h2 className="font-bold text-[#0A1628] text-sm mb-3">SNS / 홈페이지</h2>
              <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{background:"#F7F9FF"}}>
                <span className="text-sm text-[#0A1628]">Instagram @{popup.brand}_공식</span>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{background:"linear-gradient(135deg,#f58529,#dd2a7b,#8134af,#515bd4)"}}>
                  <Instagram size={16} color="#fff"/>
                </div>
              </div>
            </div>

            {/* 제보하기 */}
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#0A1628] text-sm">제보하기</h2>
              <button onClick={()=>setReported(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#2263EC]">
                <Flag size={12}/> {reported?"제보 접수 완료 ✓":"이 팝업 정보 수정/정정 제보하기"}
              </button>
            </div>

            {/* 키워드 */}
            <div>
              <h2 className="font-bold text-[#0A1628] text-sm mb-3">키워드</h2>
              <div className="flex flex-wrap gap-2">
                {keywords.map(k=>(
                  <span key={k} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{background:"#F0F4FF",color:"#6B7A99"}}>#{k}</span>
                ))}
              </div>
            </div>

            {/* 관련 팝업 추천 */}
            {related.length>0&&(
              <div>
                <h2 className="font-bold text-[#0A1628] text-sm mb-3">당신을 위한 추천 팝업</h2>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                  {related.map(p=><RelatedPopupCard key={p.id} p={p} onOpenDetail={onOpenDetail}/>)}
                </div>
              </div>
            )}
          </div>
        )}

        {tab==="리뷰"&&(
          <div className="pt-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#6B7A99]">방문객들이 남긴 생생한 후기예요</p>
              <button onClick={()=>setShowReviewForm(!showReviewForm)}
                className="flex items-center gap-1.5 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex-shrink-0"
                style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:"0 4px 12px rgba(34,99,236,0.3)"}}>
                <PlusCircle size={13}/> 리뷰 작성
              </button>
            </div>

            {showReviewForm&&(
              <div className="bg-white rounded-xl p-4 mb-4" style={{border:"1.5px solid rgba(34,99,236,0.15)"}}>
                <div className="flex gap-1 mb-3">
                  {Array.from({length:5}).map((_,i)=>(
                    <button key={i} onClick={()=>setReviewRating(i+1)}>
                      <Star size={20} fill={i<reviewRating?"#F59E0B":"none"} color="#F59E0B"/>
                    </button>
                  ))}
                </div>
                <textarea value={reviewText} onChange={e=>setReviewText(e.target.value)} placeholder="방문 후기를 남겨주세요..."
                  className="w-full rounded-xl p-3 text-sm outline-none resize-none mb-3" rows={3}
                  style={{background:"#F7F9FF",border:"1px solid rgba(34,99,236,0.1)"}}/>
                <button onClick={()=>setReviewPhoto(!reviewPhoto)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl mb-3"
                  style={reviewPhoto?{background:"#2263EC",color:"#fff"}:{background:"#E8F1FF",color:"#2263EC"}}>
                  <Camera size={13}/> {reviewPhoto?"인증사진 첨부됨":"인증사진 첨부 (검증용)"}
                </button>
                <div className="flex gap-2">
                  <button onClick={()=>setShowReviewForm(false)} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{background:"#F0F4FF",color:"#0A1628"}}>취소</button>
                  <button onClick={submitReview} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white" style={{background:"#2263EC"}}>등록</button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {myReviews.map((r,i)=>(
                <div key={`my-${i}`} className="bg-white rounded-xl p-4" style={{boxShadow:"0 2px 16px rgba(34,99,236,0.07)",border:"1px solid rgba(34,99,236,0.08)"}}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex">{Array.from({length:5}).map((_,j)=><Star key={j} size={12} fill={j<r.rating?"#F59E0B":"none"} color="#F59E0B"/>)}</div>
                    {r.hasPhoto?(
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full" style={{background:"#ECFDF5",color:"#10B981"}}>
                        <ShieldCheck size={10}/> 검증됨 · 신뢰도 97%
                      </span>
                    ):(
                      <span className="text-[10px] text-[#6B7A99] px-2 py-1">사진 미첨부</span>
                    )}
                  </div>
                  <p className="text-sm text-[#0A1628]">{r.text}</p>
                </div>
              ))}
              {reviews.map(r=>(
                <div key={r.id} className="bg-white rounded-xl overflow-hidden" style={{boxShadow:"0 4px 24px rgba(34,99,236,0.08)",border:"1px solid rgba(34,99,236,0.08)"}}>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={`https://images.unsplash.com/photo-${r.avatar}?w=64&h=64&fit=crop`} alt={r.user} className="w-9 h-9 rounded-full object-cover"/>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#0A1628]">{r.user}</p>
                        <div className="flex">{Array.from({length:5}).map((_,j)=><Star key={j} size={11} fill={j<r.rating?"#F59E0B":"none"} color="#F59E0B"/>)}</div>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0" style={{background:"#ECFDF5",color:"#10B981"}}>
                        <ShieldCheck size={10}/> 검증됨 · 신뢰도 {96+(r.id%3)}%
                      </span>
                    </div>
                    <p className="text-sm text-[#0A1628] leading-relaxed mb-3">{r.text}</p>
                    <div className="rounded-xl px-3.5 py-2.5" style={{background:"#E8F1FF"}}>
                      <p className="text-[10px] text-[#2263EC] font-bold flex items-center gap-1 mb-0.5"><Sparkles size={10}/> AI 리뷰 요약</p>
                      <p className="text-xs text-[#0A1628] font-medium">{r.aiSummary}</p>
                    </div>
                  </div>
                </div>
              ))}
              {totalReviews===0&&(
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3" style={{background:"#E8F1FF"}}>
                    <MessageCircle size={24} color="#2263EC"/>
                  </div>
                  <p className="text-sm text-[#6B7A99]">아직 등록된 후기가 없어요. 첫 후기를 남겨보세요!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 하단 고정 액션바 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white flex items-center gap-3 px-6 py-3 max-w-6xl mx-auto"
        style={{borderTop:"1px solid rgba(34,99,236,0.1)",boxShadow:"0 -4px 20px rgba(34,99,236,0.08)"}}>
        <button onClick={()=>onToggleLike(popup.id)} className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#F0F4FF"}}>
          <Heart size={18} fill={liked?"#EF4444":"none"} color={liked?"#EF4444":"#6B7A99"}/>
        </button>
        <button onClick={share} className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:"#F0F4FF"}}>
          <Share2 size={18} color="#6B7A99"/>
        </button>
        <button onClick={()=>{ setTab("정보"); setShowReserve(true); }} disabled={!!reservation}
          className="flex-1 py-3.5 rounded-xl text-white text-sm font-bold disabled:opacity-70"
          style={{background:reservation?"#10B981":"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:"0 4px 16px rgba(34,99,236,0.3)"}}>
          {reservation?"예약 완료 ✓":"지금 예약하기"}
        </button>
      </div>
    </div>
  );
}

/* ═══ CHATBOT ═══ */
const INIT_MSGS=[{role:"bot" as const,text:"안녕하세요! 저는 찰리예요 🤖\n자연어로 팝업 코스를 추천받아보세요!"}];
const Q_LIST=["이번 주 갈 수 있는 팝업 코스 추천해줘","성수 팝업 중 대기 짧은 곳은?","패션 팝업 예약 필요한 곳 알려줘"];
const ANSWERS:Record<string,string>={
  "이번 주 갈 수 있는 팝업 코스 추천해줘":"취향(패션·아트) 기반 추천! ①NewJeans×Musinsa(성수, 10시) → ②Gentle Monster(홍대, 오후1시) → ③MARDI MERCREDI(홍대, 오후3시). 총 예상 대기 35분, 도보 이동 위주예요 ✨",
  "성수 팝업 중 대기 짧은 곳은?":"NewJeans×Musinsa는 오전 10–11시 방문 시 대기 약 5–10분으로 가장 짧아요. 평일 오전이 최적이에요 📊",
  "패션 팝업 예약 필요한 곳 알려줘":"사전 예약 필요 팝업: ①NewJeans×Musinsa (무신사 앱 → 팝업 탭). 무료 입장은 Gentle Monster, MARDI MERCREDI가 있어요 🗓"
};

function RecentViewRail({ history, onOpenDetail }:{ history:number[]; onOpenDetail:(id:number)=>void }) {
  const items = history.map(id=>ALL_POPUPS.find(p=>p.id===id)).filter((p):p is Popup=>!!p);
  if(items.length===0) return null;
  const today=5;
  return (
    <div className="hidden 2xl:flex flex-col fixed left-6 top-20 w-48 p-1.5 z-30"
      style={{maxHeight:"78vh",overflowY:"auto"}}>
      <p className="text-[10px] text-[#6B7A99] font-bold uppercase tracking-wide mb-2 px-0.5">최근 본 팝업</p>
      <div className="relative flex flex-col">
        <div className="absolute top-5 bottom-5" style={{left:19,borderLeft:"2px dashed rgba(34,99,236,0.25)"}}/>
        {items.map((p,i)=>{
          const s=dayOfMonth(p.startDate), e=dayOfMonth(p.endDate);
          const openDay=Math.max(1,today-s+1);
          const daysLeft=e-today;
          return (
            <button key={p.id} onClick={()=>onOpenDetail(p.id)} className="relative flex items-start gap-2.5 py-2.5 text-left">
              <img src={imgUrl(p.imgId,80,80)} alt={p.name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 relative z-10"
                style={{border:"2px solid #fff",boxShadow:"0 0 0 1px rgba(34,99,236,0.18)"}}/>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{background:"#F0F4FF",color:"#6B7A99"}}>{p.category}</span>
                  {p.isHot&&<span className="text-[9px] font-bold flex items-center gap-0.5 flex-shrink-0" style={{color:"#F97316"}}>🔥 급상승</span>}
                </div>
                <p className="text-xs font-bold text-[#0A1628] leading-snug line-clamp-2 mt-1">{p.name}</p>
                <p className="text-[10px] text-[#6B7A99] mt-0.5">오픈 {openDay}일차 {daysLeft<=0?"(종료 당일)":`(${daysLeft}일 남음)`}</p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5 flex items-center gap-1"><Eye size={10}/> {p.likes.toLocaleString()}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const AI_FLOW_STEPS=[
  {phase:"탐색",title:"내 취향에 맞는 팝업,\n한눈에 모아보기",desc:"카테고리·지역별로 지금 뜨는 팝업을 찾아보세요",icon:<Search size={18} color="#fff"/>},
  {phase:"계획",title:"한 동네 인기 팝업,\n코스로 미리 짜기",desc:"AI 추천 코스로 동선 고민 없이 출발",icon:<Route size={18} color="#fff"/>},
  {phase:"당일",title:"혼잡도까지 반영한\n실시간 안내",desc:"운영시간·혼잡도를 확인하고 여유롭게 즐기세요",icon:<TrendingUp size={18} color="#fff"/>},
];

function AiEntryRail({ aiCredits, onTry }:{ aiCredits:number; onTry:()=>void }) {
  const [step,setStep]=useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setStep(s=>(s+1)%AI_FLOW_STEPS.length),3500);
    return ()=>clearInterval(t);
  },[]);
  const cur=AI_FLOW_STEPS[step];

  return (
    <div className="hidden 2xl:flex flex-col fixed right-6 top-20 w-48 rounded-xl overflow-hidden z-30"
      style={{background:"#fff",border:"1px solid rgba(34,99,236,0.08)",boxShadow:"0 16px 48px rgba(34,99,236,0.14)"}}>
      <div className="h-1 w-full" style={{background:"rgba(34,99,236,0.1)"}}>
        <motion.div className="h-full" animate={{width:`${((step+1)/AI_FLOW_STEPS.length)*100}%`}} transition={{duration:0.4}} style={{background:"#2263EC"}}/>
      </div>
      <div className="p-3.5">
        <span className="inline-block text-[10px] font-bold px-2 py-1 rounded-full mb-3" style={{background:"#F0F4FF",color:"#2263EC"}}>
          {String(step+1).padStart(2,"0")} · {cur.phase}
        </span>
        <Icon3D gradient="linear-gradient(145deg,#4F8EF7,#2263EC)" size={32}>{cur.icon}</Icon3D>
        <p className="text-sm font-extrabold text-[#0A1628] mt-3 leading-snug whitespace-pre-line">{cur.title}</p>
        <p className="text-[11px] text-[#6B7A99] mt-1.5">{cur.desc}</p>

        <div className="flex items-center justify-between mt-4">
          {AI_FLOW_STEPS.map((s,i)=>(
            <div key={s.phase} className="flex-1 flex flex-col items-center gap-1">
              <div className="rounded-full transition-all" style={i===step?{width:7,height:7,background:"#2263EC"}:{width:5,height:5,background:"rgba(34,99,236,0.2)"}}/>
              <span className="text-[9px] font-semibold" style={{color:i===step?"#2263EC":"#94A3B8"}}>{s.phase}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-3.5" style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)"}}>
        <p className="text-white text-[11px] font-bold mb-0.5">코스 짜기 막막하신가요?</p>
        <p className="text-white/70 text-[10px] mb-2.5 leading-snug">AI가 취향에 맞는 코스를 대신 만들어드려요</p>
        <button onClick={onTry} disabled={aiCredits<=0}
          className="w-full py-2 rounded-lg text-[10px] font-bold disabled:opacity-60 leading-snug"
          style={{background:"#fff",color:"#2263EC"}}>
          {aiCredits>0?`AI 코스 생성 체험 (무료 ${aiCredits}회)`:"무료 체험 소진"}
        </button>
      </div>
    </div>
  );
}

function ChatBot({ raised }:{ raised?:boolean }) {
  const [open,setOpen]=useState(false);
  const [msgs,setMsgs]=useState(INIT_MSGS);
  const [input,setInput]=useState("");
  const buttonBottom = raised?90:24;
  const panelBottom = raised?160:96;
  function send(text:string) {
    if(!text.trim()) return;
    const botText=ANSWERS[text]||"지금은 그 질문에 대한 정보가 없어요. 다른 방식으로 물어봐 주세요!";
    setMsgs(p=>[...p,{role:"user",text},{role:"bot",text:botText}]);
    setInput("");
  }
  return (
    <>
      <motion.button whileHover={{scale:1.08}} whileTap={{scale:0.95}} onClick={()=>setOpen(!open)}
        animate={{bottom:buttonBottom}} transition={{duration:0.25}}
        className="fixed right-6 w-14 h-14 rounded-full text-white flex items-center justify-center z-50"
        style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)",boxShadow:"0 4px 20px rgba(34,99,236,0.45),0 0 0 4px rgba(34,99,236,0.12)"}}>
        {open?<X size={22}/>:<Bot size={22}/>}
      </motion.button>
      {open&&(
        <motion.div initial={{opacity:0,y:16,scale:0.95}} animate={{opacity:1,y:0,scale:1,bottom:panelBottom}} transition={{duration:0.25}}
          className="fixed right-6 w-80 rounded-xl z-50 flex flex-col overflow-hidden"
          style={{background:"#fff",border:"1.5px solid rgba(34,99,236,0.12)",boxShadow:"0 16px 60px rgba(34,99,236,0.18)",maxHeight:480}}>
          <div className="px-4 py-3 flex items-center gap-2"
            style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)"}}>
            <Icon3D gradient="rgba(255,255,255,0.22)" size={32}><Bot size={16} color="#fff"/></Icon3D>
            <div>
              <p className="text-white font-bold text-sm">찰리</p>
              <p className="text-white/60 text-[10px]">팝업 AI 어시스턴트 · 실시간 응답</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5" style={{maxHeight:220,background:"#F7F9FF"}}>
            {msgs.map((m,i)=>(
              <div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}>
                <div className="max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed whitespace-pre-line"
                  style={m.role==="user"?{background:"#2263EC",color:"#fff",borderBottomRightRadius:4}:{background:"#fff",color:"#0A1628",borderBottomLeftRadius:4,boxShadow:"0 1px 6px rgba(34,99,236,0.1)",border:"1px solid rgba(34,99,236,0.08)"}}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 flex flex-col gap-1.5 border-t" style={{borderColor:"rgba(34,99,236,0.08)"}}>
            {Q_LIST.map(q=>(
              <button key={q} onClick={()=>send(q)}
                className="text-left text-xs font-semibold py-2 px-3 rounded-xl transition-colors"
                style={{background:"#E8F1FF",color:"#2263EC"}}>
                {q}
              </button>
            ))}
          </div>
          <div className="p-2 border-t flex gap-2" style={{borderColor:"rgba(34,99,236,0.08)"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
              placeholder="메시지 입력..."
              className="flex-1 rounded-xl px-3 py-2 text-xs text-[#0A1628] placeholder-[#6B7A99] outline-none"
              style={{background:"#F0F4FF",border:"1.5px solid rgba(34,99,236,0.1)"}}/>
            <button onClick={()=>send(input)}
              className="w-9 h-9 rounded-xl text-white flex items-center justify-center flex-shrink-0"
              style={{background:"linear-gradient(135deg,#4F8EF7,#2263EC)"}}>
              <Send size={14}/>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}

/* ═══ NAV ═══ */
const NAV:{page:Page;label:string}[]=[
  {page:"home",      label:"홈"},
  {page:"find",      label:"찾기"},
  {page:"course",    label:"코스"},
  {page:"community", label:"커뮤니티"},
  {page:"my",        label:"MY기록"},
];

/* ═══ APP ═══ */
export default function App() {
  const [page,setPage]=useState<Page>("home");
  const [liked,setLiked]=useState<Set<number>>(new Set([1,3]));
  const [user,setUser]=useState<UserAccount|null>(null);
  const [selectedPopupId,setSelectedPopupId]=useState<number|null>(null);
  const [detailBackPage,setDetailBackPage]=useState<Page>("home");
  const [reservations,setReservations]=useState<Reservation[]>([{id:1,popupId:8,slot:"주말 오후 2시",status:"완료"}]);
  const [notifOpen,setNotifOpen]=useState(false);
  const [hasUnread,setHasUnread]=useState(true);
  const [viewHistory,setViewHistory]=useState<number[]>([]);
  const [aiCredits,setAiCredits]=useState(3);
  const [findCategory,setFindCategory]=useState<string|null>(null);
  function toggleLike(id:number){ setLiked(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;}); }
  function goToPage(p:Page){ setPage(p==="my"&&!user?"login":p); }
  function goToFindCategory(category:string){ setFindCategory(category); setPage("find"); }
  function handleLogout(){ setUser(null); setPage("home"); }
  function handleDeleteAccount(){ setUser(null); setLiked(new Set()); setReservations([]); setPage("home"); }
  function openDetail(id:number){
    setDetailBackPage(page); setSelectedPopupId(id); setPage("detail");
    setViewHistory(prev=>[id,...prev.filter(x=>x!==id)].slice(0,5));
  }
  function addReservation(popupId:number,slot:string){
    setReservations(prev=>[...prev,{id:Date.now(),popupId,slot,status:"예정"}]);
  }
  function useAiCredit(){ setAiCredits(c=>Math.max(0,c-1)); }

  const isAuthPage=page==="login"||page==="signup"||page==="findId"||page==="findPassword";
  const selectedPopup = selectedPopupId!==null ? ALL_POPUPS.find(p=>p.id===selectedPopupId) : undefined;
  const notifications=[
    ...reservations.slice().reverse().map(r=>{
      const p=ALL_POPUPS.find(x=>x.id===r.popupId);
      return p?{id:`res-${r.id}`,title:"예약이 확정됐어요",desc:`${p.name} · ${r.slot}`,time:"방금 전"}:null;
    }).filter((n):n is {id:string;title:string;desc:string;time:string}=>n!==null),
    {id:"n1",title:"오픈 알림",desc:"NewJeans × Musinsa 팝업이 내일 오전 10시 오픈해요!",time:"2시간 전"},
    {id:"n2",title:"마감 임박",desc:"Gentle Monster DREAM FACTORY 종료까지 3일 남았어요",time:"어제"},
    {id:"n3",title:"동행 모집 댓글",desc:"작성하신 게시글에 새 댓글이 달렸어요",time:"2일 전"},
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" style={{fontFamily:"'Plus Jakarta Sans','Noto Sans KR',sans-serif"}}>
      {/* Navbar */}
      <nav className="sticky top-0 z-40"
        style={{background:"rgba(255,255,255,0.82)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(34,99,236,0.09)",boxShadow:"0 1px 24px rgba(34,99,236,0.06)"}}>
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-5 py-2 min-h-[60px]">
          <button onClick={()=>setPage("home")} className="flex-shrink-0 flex items-center -ml-2">
            <span className="flex flex-col leading-none text-left">
              <span className="text-[10px] font-bold" style={{color:"#2263EC",letterSpacing:"0.12em"}}>CHARLIE'S</span>
              <span className="text-base font-extrabold mt-1" style={{color:"#0A1628",letterSpacing:"-0.02em"}}>팝업공장.</span>
            </span>
          </button>
          {!isAuthPage&&(
            <div className="flex-1 flex items-center justify-center gap-5 overflow-x-auto scrollbar-hide">
              {NAV.map(item=>(
                <button key={item.page} onClick={()=>goToPage(item.page)}
                  className="py-2 text-[14px] font-semibold whitespace-nowrap transition-colors"
                  style={{color:page===item.page?"#0A1628":"#6B7A99",borderBottom:"2px solid",borderColor:page===item.page?"#2263EC":"transparent"}}>
                  {item.label}
                </button>
              ))}
            </div>
          )}
          {!isAuthPage&&(
            <div className="ml-auto flex items-center gap-2 flex-shrink-0">
              {user?(
                <>
                  <div className="relative">
                    <button onClick={()=>{setNotifOpen(o=>!o);setHasUnread(false);}}
                      className="relative w-9 h-9 rounded-full flex items-center justify-center" style={{background:"#F0F4FF"}}>
                      <Bell size={16} color="#2263EC"/>
                      {hasUnread&&<div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border border-white"/>}
                    </button>
                    {notifOpen&&(
                      <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                        className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden z-50"
                        style={{background:"#fff",border:"1.5px solid rgba(34,99,236,0.12)",boxShadow:"0 16px 48px rgba(34,99,236,0.18)"}}>
                        <div className="px-4 py-3" style={{borderBottom:"1px solid rgba(34,99,236,0.08)"}}>
                          <p className="font-bold text-sm text-[#0A1628]">알림</p>
                        </div>
                        <div className="flex flex-col" style={{maxHeight:340,overflowY:"auto"}}>
                          {notifications.map(n=>(
                            <div key={n.id} className="px-4 py-3 flex items-start gap-3" style={{borderBottom:"1px solid rgba(34,99,236,0.06)"}}>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:"#E8F1FF"}}>
                                <Bell size={13} color="#2263EC"/>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-[#0A1628]">{n.title}</p>
                                <p className="text-xs text-[#6B7A99] mt-0.5">{n.desc}</p>
                                <p className="text-[10px] text-[#6B7A99] mt-1">{n.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <button onClick={()=>setPage("my")} className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                    style={{border:"2px solid #2263EC",boxShadow:"0 2px 8px rgba(34,99,236,0.2)"}}>
                    <img src={imgUrl("1494790108377-be9c29b29330",72,72)} alt="프로필" className="w-full h-full object-cover"/>
                  </button>
                </>
              ):(
                <button onClick={()=>setPage("login")}
                  className="text-sm font-bold flex-shrink-0" style={{color:"#2263EC"}}>
                  로그인
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {page==="home"        &&
        <HomePage liked={liked} onToggleLike={toggleLike} onOpenDetail={openDetail} onSelectCategory={goToFindCategory}
          reservations={reservations} onReserve={addReservation}/>}
      {page==="find"        &&<FindPage liked={liked} onToggleLike={toggleLike} onOpenDetail={openDetail} initialCategory={findCategory}/>}
      {page==="course"      &&<CoursePage liked={liked} onToggleLike={toggleLike} onOpenDetail={openDetail} aiCredits={aiCredits} onUseCredit={useAiCredit}/>}
      {page==="my"          && user &&
        <MyPage liked={liked} user={user} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} reservations={reservations}/>}
      {page==="community"   &&<CommunityPage/>}
      {page==="login"       &&<LoginPage onLogin={setUser} goTo={setPage}/>}
      {page==="signup"      &&<SignupPage onSignupComplete={setUser} goTo={setPage}/>}
      {page==="findId"      &&<FindIdPage goTo={setPage}/>}
      {page==="findPassword"&&<FindPasswordPage goTo={setPage}/>}
      {page==="detail" && selectedPopup &&
        <PopupDetailPage popup={selectedPopup} liked={liked.has(selectedPopup.id)} onToggleLike={toggleLike} onBack={()=>setPage(detailBackPage)}
          reservation={reservations.find(r=>r.popupId===selectedPopup.id)} onReserve={addReservation} onOpenDetail={openDetail}/>}
      {!isAuthPage &&<RecentViewRail history={viewHistory} onOpenDetail={openDetail}/>}
      {!isAuthPage &&<AiEntryRail aiCredits={aiCredits} onTry={()=>setPage("course")}/>}
      {!isAuthPage &&<ChatBot raised={page==="detail"}/>}
    </div>
  );
}
