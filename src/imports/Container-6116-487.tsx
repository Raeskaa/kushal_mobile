function Heading() {
  return (
    <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-h-px min-w-px not-italic relative text-[#420d74] text-[30px] text-center tracking-[0.3955px] whitespace-pre-wrap">Check your inbox</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[191.24px] not-italic text-[#4a5565] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">{`We've sent a 6-digit code to mahesh@trueleap.io`}</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[64px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function Label() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Label">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[191.97px] not-italic text-[#101828] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Enter the code we just sent you.</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-[48px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-[48px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TextInput2() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-[48px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TextInput3() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-[48px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TextInput4() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-[48px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function TextInput5() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-[48px]" data-name="Text Input">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[56px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start justify-between px-[8px] relative size-full">
        <TextInput />
        <TextInput1 />
        <TextInput2 />
        <TextInput3 />
        <TextInput4 />
        <TextInput5 />
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[100px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <Container4 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#420d74] content-stretch flex h-[48px] items-center justify-center opacity-50 relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.3125px]">Verify</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[24px] left-[198.93px] top-0 w-[96.188px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[48.5px] not-italic text-[#420d74] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px]">Resend code</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[142.88px] not-italic text-[#4a5565] text-[14px] text-center top-[3.5px] tracking-[-0.1504px]">{`Didn't receive it?`}</p>
      <Button1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[147.86px] size-[12px] top-[2px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M6 9.5L2.5 6L6 2.5" id="Vector" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 6H2.5" id="Vector_2" stroke="var(--stroke-0, #6A7282)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Button">
      <Icon />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[199.36px] not-italic text-[#6a7282] text-[12px] text-center top-px">Edit address</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[56px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph1 />
      <Button2 />
    </div>
  );
}

function SignIn() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] h-[268px] items-start relative shrink-0 w-full" data-name="SignIn">
      <Container3 />
      <Button />
      <Container5 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white h-[430px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[32px] items-start pb-px pt-[33px] px-[33px] relative size-full">
        <Container2 />
        <SignIn />
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[219.17px] top-px w-[32.539px]" data-name="Link">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#420d74] text-[12px] text-center">terms</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[258.65px] top-px w-[77.125px]" data-name="Link">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#420d74] text-[12px] text-center">privacy policy</p>
    </div>
  );
}

function Link2() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-start left-[367.09px] top-px w-[73.375px]" data-name="Link">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#420d74] text-[12px] text-center">cookie policy</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[111.97px] not-italic text-[#6a7282] text-[12px] text-center top-px w-[216px] whitespace-pre-wrap">{`By continuing, I agree to Leapspace's`}</p>
      <Link />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[255.21px] not-italic text-[#6a7282] text-[12px] text-center top-px w-[7px] whitespace-pre-wrap">,</p>
      <Link1 />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[351.77px] not-italic text-[#6a7282] text-[12px] text-center top-px w-[32px] whitespace-pre-wrap">, and</p>
      <Link2 />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-[442.46px] not-italic text-[#6a7282] text-[12px] text-center top-px">.</p>
    </div>
  );
}

export default function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[32px] items-start relative size-full" data-name="Container">
      <Container1 />
      <Paragraph2 />
    </div>
  );
}