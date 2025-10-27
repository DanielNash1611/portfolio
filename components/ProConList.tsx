import { Check, X } from "lucide-react";

interface ListItem {
  title: string;
  description?: string;
}

interface ProConListProps {
  pros: ListItem[];
  cons: ListItem[];
}

const ProConList = ({ pros, cons }: ProConListProps): JSX.Element => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-3xl border border-brand-teal/20 bg-brand-teal/5 p-6">
        <div className="flex items-center gap-3 text-brand-teal">
          <Check className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Strengths</h3>
        </div>
        <ul className="space-y-3 text-sm text-brand-slate/80">
          {pros.map((item) => (
            <li key={item.title} className="space-y-1">
              <p className="font-medium text-brand-teal">{item.title}</p>
              {item.description ? <p>{item.description}</p> : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4 rounded-3xl border border-brand-orange/20 bg-brand-orange/5 p-6">
        <div className="flex items-center gap-3 text-brand-orange">
          <X className="h-5 w-5" aria-hidden="true" />
          <h3 className="text-lg font-semibold">Opportunities</h3>
        </div>
        <ul className="space-y-3 text-sm text-brand-slate/80">
          {cons.map((item) => (
            <li key={item.title} className="space-y-1">
              <p className="font-medium text-brand-orange">{item.title}</p>
              {item.description ? <p>{item.description}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProConList;
