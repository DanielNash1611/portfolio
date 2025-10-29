interface DemoFrameProps {
  text: string;
}

const DemoFrame = ({ text }: DemoFrameProps): JSX.Element => {
  return (
    <div className="rounded-3xl border-2 border-dashed border-brand-teal/40 bg-white/60 p-8 text-center shadow-soft">
      <p className="text-base font-medium text-brand-teal">{text}</p>
    </div>
  );
};

export default DemoFrame;
