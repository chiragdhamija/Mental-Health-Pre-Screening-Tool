<div className="Parent-Dashboard-card-container-PD">
{/* Render Card components dynamically */}
{children.map((child) => (
  <Card
    key={child._id}
    role={child.name}
    statement={`${child.school} - Age: ${child.age}`}
    isSelected={selectedChild === child.name}
    onSelect={() => setselectedChild(child.name)}
  />
))}
</div>


line 82