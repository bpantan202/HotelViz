export default function RegionButton({ name, selected, onRegion }: { name: string, selected: boolean, onRegion: any}) {
    return (
        !selected ? 
            <button onClick={(e) => { 
                e.stopPropagation();
                onRegion();
            }} 
                className="hover:translate-y-[-3px] transition-all duration-250 ease-in-out hover:shadow-md rounded-full bg-slate-100 px-5 py-2 text-sky-600 shadow-sm font-bold">{name}</button> :
            <button onClick={(e) => { 
                e.stopPropagation();
                onRegion();
            }} 
                className="hover:translate-y-[-3px] transition-all duration-250 ease-in-out hover:shadow-md rounded-full text-slate-100 px-5 py-2 bg-sky-600 shadow-sm font-bold">{name}</button>
    )
}
