function Heading() {
  return (
    <div className="content-stretch flex h-[36px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[36px] min-h-px min-w-px not-italic relative text-[#420d74] text-[30px] text-center tracking-[0.3955px] whitespace-pre-wrap">Complete your profile</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-[191.18px] not-italic text-[#4a5565] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">Just one last step to get you started</p>
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
      <p className="-translate-x-1/2 absolute font-['Inter:Medium',sans-serif] font-medium leading-[20px] left-[191.08px] not-italic text-[#101828] text-[14px] text-center top-[0.5px] tracking-[-0.1504px]">{`What's your full name?`}</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-white h-[56px] relative rounded-[10px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(16,24,40,0.5)] tracking-[-0.3125px]">e.g. Sarah Chen</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[92px] items-start relative shrink-0 w-full" data-name="Container">
      <Label />
      <TextInput />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#420d74] content-stretch flex h-[48px] items-center justify-center opacity-50 relative rounded-[10px] shrink-0 w-full" data-name="Button">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic relative shrink-0 text-[16px] text-center text-white tracking-[-0.3125px]">Finish Setup</p>
    </div>
  );
}

function ProfileCompletionCard() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[164px] items-start relative shrink-0 w-full" data-name="ProfileCompletionCard">
      <Container3 />
      <Button />
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-white h-[326px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <div className="content-stretch flex flex-col gap-[32px] items-start pb-px pt-[33px] px-[33px] relative size-full">
        <Container2 />
        <ProfileCompletionCard />
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

function Paragraph1() {
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
      <Paragraph1 />
    </div>
  );
}