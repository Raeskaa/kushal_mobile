import svgPaths from "./svg-q9oh9mn2jx";

function Heading() {
  return (
    <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-h-px min-w-px not-italic relative text-[#420d74] text-[30px] text-center tracking-[0.3955px] whitespace-pre-wrap">Log back in</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[190.54px] not-italic text-[#4a5565] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Choose an account to continue.</p>
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

function Container4() {
  return (
    <div className="bg-[#155dfc] relative rounded-[16777200px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[28px] not-italic relative shrink-0 text-[18px] text-white tracking-[-0.4395px]">R</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-0 not-italic text-[#101828] text-[14px] top-[0.5px] tracking-[-0.1504px]">Raeskaaa</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">mahesh@trueleap.io</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph1 />
        <Paragraph2 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333">
            <path d={svgPaths.p48af40} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.33333 9.33333">
            <path d={svgPaths.p30908200} id="Vector" stroke="var(--stroke-0, #99A1AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[16777200px] shrink-0 size-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] px-[4px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function SignIn() {
  return (
    <div className="h-[74px] relative rounded-[14px] shrink-0 w-full" data-name="SignIn">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center px-[17px] py-px relative size-full">
          <Container4 />
          <Container5 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="flex-[1_0_0] h-px min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16px] relative shrink-0 w-[17.32px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-0 not-italic text-[#6a7282] text-[12px] top-px">OR</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="flex-[1_0_0] h-px min-h-px min-w-px relative" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-solid border-t inset-0 pointer-events-none" />
    </div>
  );
}

function SignIn1() {
  return (
    <div className="content-stretch flex gap-[16px] h-[32px] items-center relative shrink-0 w-full" data-name="SignIn">
      <Container6 />
      <Text />
      <Container7 />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white h-[48px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[190.73px] not-italic text-[#101828] text-[14px] text-center top-[14.5px] tracking-[-0.1504px]">Log in to another account</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[48px] relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[191.02px] not-italic text-[#101828] text-[14px] text-center top-[14.5px] tracking-[-0.1504px]">Create account</p>
    </div>
  );
}

function SignIn2() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[108px] items-start relative shrink-0 w-full" data-name="SignIn">
      <Button1 />
      <Button2 />
    </div>
  );
}

function SignIn3() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="SignIn">
      <p className="-translate-x-1/2 absolute decoration-solid font-['Inter:Medium',sans-serif] font-medium leading-[16px] left-[191.01px] not-italic text-[#99a1af] text-[12px] text-center top-[5px] underline">Stay logged out</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[310px] items-start relative shrink-0 w-full" data-name="Container">
      <SignIn />
      <SignIn1 />
      <SignIn2 />
      <SignIn3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white h-[472px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[32px] items-start pb-px pt-[33px] px-[33px] relative size-full">
        <Container2 />
        <Container3 />
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

function Paragraph3() {
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
      <Paragraph3 />
    </div>
  );
}