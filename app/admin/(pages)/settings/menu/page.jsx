// app/settings/menu/page.jsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  GripVertical,
  Pencil,
  Trash2,
  Plus,
  Search,
  Bell,
  User,
  ChevronRight,
  Info,
  HelpCircle,
  Layers,
  Save,
  X,
} from 'lucide-react';

// Components
import Header from '../../../../_components/Admin/Header';
import Sidebar from '../../../../_components/Admin/Sidebar';
import Button from '../../../../_components/Admin/Button';

// Sortable Menu Item Component
const SortableMenuItem = ({ item, onEdit, onDelete, onAddChild, depth = 0 }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="space-y-2">
        <div className="menu-item-hover group bg-surface border border-outline-variant rounded-lg p-3 flex items-center justify-between hover:shadow-sm transition-all">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              {...listeners}
              className="drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-surface-container-high rounded touch-none flex-shrink-0"
            >
              <GripVertical size={20} className="text-on-surface-variant" />
            </button>
            <div className="flex-1 min-w-0">
              <span className="font-body-md font-bold truncate block">{item.title}</span>
              <span className="text-body-sm text-on-surface-variant truncate block">{item.url}</span>
            </div>
          </div>
          <div className="action-buttons opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 ml-3 flex-shrink-0">
            {depth < 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddChild(item.id);
                }}
                className="p-1.5 hover:bg-primary-container/20 rounded-lg text-primary transition-colors"
                title="Add child item"
              >
                <Plus size={16} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              className="p-1.5 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="p-1.5 hover:bg-error-container/20 rounded-lg text-error transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        {/* Render children recursively if they exist */}
        {item.children && item.children.length > 0 && (
          <div className="pl-8 space-y-2 border-l-2 border-outline-variant ml-6">
            <SortableContext
              items={item.children.map(child => child.id)}
              strategy={verticalListSortingStrategy}
            >
              {item.children.map((child) => (
                <SortableMenuItem
                  key={child.id}
                  item={child}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={depth < 2 ? onAddChild : null}
                  depth={depth + 1}
                />
              ))}
            </SortableContext>
            {depth < 1 && (
              <button
                onClick={() => onAddChild && onAddChild(item.id)}
                className="flex items-center gap-2 text-primary hover:bg-primary-container/10 px-3 py-2 rounded-lg text-body-sm transition-colors w-full"
              >
                <Plus size={16} />
                Add item to {item.title}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add/Edit Menu Item Modal Component - FIXED
const MenuItemModal = ({ isOpen, onClose, onSave, editingItem, parentId }) => {
  const [formData, setFormData] = useState({
    title: editingItem?.title || '',
    url: editingItem?.url || '',
  });

  React.useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        url: editingItem.url,
      });
    } else {
      setFormData({ title: '', url: '' });
    }
  }, [editingItem, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) {
      alert('Please fill in both title and URL');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with higher z-index */}
      <div 
        className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content with higher z-index */}
      <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
        <div className="w-full min-w-[400px] pointer-events-auto relative bg-surface-container-lowest rounded-xl shadow-2xl w-full max-w-lg mx-4 animate-in fade-in zoom-in duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-outline-variant">
            <h3 className="font-headline-md text-headline-md text-on-surface">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-high rounded-lg transition-colors text-on-surface-variant hover:text-on-surface"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {/* Title Field */}
              <div>
                <label 
                  htmlFor="menu-item-title"
                  className="block text-label-md mb-2 text-on-surface font-medium"
                >
                  Title <span className="text-error">*</span>
                </label>
                <input
                  id="menu-item-title"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-on-surface-variant/50"
                  type="text"
                  placeholder="e.g., Contact Us, About, Shop"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  autoFocus
                />
                <p className="text-body-sm text-on-surface-variant mt-1">
                  The text that will appear in your navigation menu
                </p>
              </div>

              {/* URL Field */}
              <div>
                <label 
                  htmlFor="menu-item-url"
                  className="block text-label-md mb-2 text-on-surface font-medium"
                >
                  URL <span className="text-error">*</span>
                </label>
                <input
                  id="menu-item-url"
                  className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none placeholder:text-on-surface-variant/50 font-mono"
                  type="text"
                  placeholder="e.g., /pages/contact, /collections/all"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                />
                <p className="text-body-sm text-on-surface-variant mt-1">
                  The link destination (internal path or full URL)
                </p>
              </div>

              {/* Parent Info (if adding child) */}
              {parentId && (
                <div className="bg-primary-container/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-body-sm text-on-surface-variant flex items-center gap-2">
                    <Info size={14} className="text-primary" />
                    This item will be added as a nested item
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-outline-variant bg-surface-container-low/50 rounded-b-xl">
              <Button
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                icon={editingItem ? <Pencil size={16} /> : <Plus size={16} />}
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Main Menu Editor Page
const MenuEditorPage = () => {
  const [menuTitle, setMenuTitle] = useState('Main menu');
  const [menuHandle, setMenuHandle] = useState('main-menu');
  const [activeId, setActiveId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [parentId, setParentId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Initialize menu items with nested structure
  const [menuItems, setMenuItems] = useState([
    {
      id: '1',
      title: 'Home',
      url: '/',
      children: [],
    },
    {
      id: '2',
      title: 'Shop',
      url: '/collections/all',
      children: [
        {
          id: '2-1',
          title: 'New Arrivals',
          url: '/collections/new',
          children: [],
        },
        {
          id: '2-2',
          title: 'Best Sellers',
          url: '/collections/popular',
          children: [],
        },
      ],
    },
    {
      id: '3',
      title: 'About Us',
      url: '/pages/about',
      children: [],
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to find item by ID recursively
  const findItem = (items, id) => {
    for (let item of items) {
      if (item.id === id) return { item, parent: items };
      if (item.children) {
        const found = findItem(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeResult = findItem(menuItems, active.id);
    const overResult = findItem(menuItems, over.id);

    if (!activeResult || !overResult) return;

    const activeParent = activeResult.parent;
    const overParent = overResult.parent;

    if (activeParent === overParent) {
      const oldIndex = activeParent.findIndex(item => item.id === active.id);
      const newIndex = overParent.findIndex(item => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updateParentArray = (items, targetParent, oldIdx, newIdx) => {
          const newItems = [...items];
          
          const updateRecursive = (currentItems) => {
            for (let i = 0; i < currentItems.length; i++) {
              if (currentItems === targetParent) {
                const reordered = arrayMove(currentItems, oldIdx, newIdx);
                return reordered;
              }
              if (currentItems[i].children) {
                const result = updateRecursive(currentItems[i].children);
                if (result) {
                  currentItems[i].children = result;
                  return currentItems;
                }
              }
            }
            return null;
          };

          const updated = updateRecursive(newItems);
          return updated || newItems;
        };

        setMenuItems(updateParentArray(menuItems, activeParent, oldIndex, newIndex));
      }
    }
  };

  // Handle edit item
  const handleEdit = (item) => {
    setEditingItem(item);
    setParentId(null);
    setShowModal(true);
  };

  // Handle delete item
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this menu item? This action cannot be undone.')) {
      const removeItem = (items) => {
        return items.filter(item => {
          if (item.id === id) return false;
          if (item.children) {
            item.children = removeItem(item.children);
          }
          return true;
        });
      };

      setMenuItems(removeItem([...menuItems]));
      setSaveMessage('Item deleted. Save to apply changes.');
    }
  };

  // Handle add child
  const handleAddChild = (parentId) => {
    setParentId(parentId);
    setEditingItem(null);
    setShowModal(true);
  };

  // Handle save item (add or edit)
  const handleSaveItem = (formData) => {
    if (editingItem) {
      // Update existing item
      const updateItem = (items) => {
        return items.map(item => {
          if (item.id === editingItem.id) {
            return { ...item, title: formData.title, url: formData.url };
          }
          if (item.children) {
            item.children = updateItem(item.children);
          }
          return item;
        });
      };

      setMenuItems(updateItem([...menuItems]));
      setSaveMessage('Item updated. Save to apply changes.');
    } else {
      // Add new item
      const newId = `item-${Date.now()}`;
      const itemToAdd = {
        id: newId,
        title: formData.title,
        url: formData.url,
        children: [],
      };

      if (parentId) {
        // Add as child
        const addChildToParent = (items) => {
          return items.map(item => {
            if (item.id === parentId) {
              return {
                ...item,
                children: [...(item.children || []), itemToAdd],
              };
            }
            if (item.children) {
              item.children = addChildToParent(item.children);
            }
            return item;
          });
        };

        setMenuItems(addChildToParent([...menuItems]));
      } else {
        // Add as root item
        setMenuItems([...menuItems, itemToAdd]);
      }
      setSaveMessage('Item added. Save to apply changes.');
    }

    setShowModal(false);
    setParentId(null);
    setEditingItem(null);
  };

  // Handle save menu
  const handleSaveMenu = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving menu:', {
        title: menuTitle,
        handle: menuHandle,
        items: menuItems,
      });
      setSaveMessage('Menu saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error saving menu. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Sidebar />
      <Header />

      {/* Main Content */}
      <main className="ml-[240px] pt-16 min-h-screen relative">
        <header className="p-8 border-b border-outline-variant bg-surface-container-lowest flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
           
            <h2 className="font-headline-lg text-headline-lg">Main menu</h2>
            {saveMessage && (
              <p className="text-body-sm text-primary mt-2 animate-in fade-in">
                {saveMessage}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveMenu}
              disabled={isSaving}
              icon={<Save size={16} />}
            >
              {isSaving ? 'Saving...' : 'Save menu'}
            </Button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-lg">
          {/* Left: Settings */}
          <div className="md:col-span-1 space-y-lg">
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="font-headline-md text-headline-md mb-4">Menu Details</h3>
              <div className="space-y-4">
                <div>
                  <label 
                    htmlFor="menu-title"
                    className="block text-label-md mb-2 text-on-surface-variant font-medium"
                  >
                    Title
                  </label>
                  <input
                    id="menu-title"
                    className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    type="text"
                    value={menuTitle}
                    onChange={(e) => setMenuTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label 
                    htmlFor="menu-handle"
                    className="block text-label-md mb-2 text-on-surface-variant font-medium"
                  >
                    Handle
                  </label>
                  <div className="relative">
                    <input
                      id="menu-handle"
                      className="w-full bg-surface border border-outline-variant rounded-lg px-3 py-2.5 pr-10 text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-mono"
                      type="text"
                      value={menuHandle}
                      onChange={(e) => setMenuHandle(e.target.value)}
                    />
                    <HelpCircle
                      size={18}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant cursor-help"
                      title="Used in theme code to reference this menu"
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className="p-6 bg-secondary-container/30 rounded-xl border border-dashed border-outline-variant">
              <div className="flex items-start gap-4">
                <Info size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-body-sm text-on-surface-variant">
                  This menu is currently used as the primary navigation for your{' '}
                  <b>Storefront Theme</b>. Changes will reflect live upon saving.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Tree Editor */}
          <div className="md:col-span-2 space-y-lg">
            <section className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-headline-md text-headline-md">Menu Items</h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {menuItems.length} {menuItems.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                 <Button
                   onClick={() => {
                     setParentId(null);
                     setEditingItem(null);
                     setShowModal(true);
                   }}
                   variant="text"
                   icon={<Plus size={18} />}
                 >
                   Add item
                 </Button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={menuItems.map(item => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <SortableMenuItem
                        key={item.id}
                        item={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAddChild={handleAddChild}
                        depth={0}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeId ? (
                    <div className="bg-surface border-2 border-primary rounded-lg p-3 shadow-lg opacity-95 rotate-2">
                      <div className="flex items-center gap-3">
                        <GripVertical size={20} className="text-primary" />
                        <div>
                          <span className="font-body-md font-bold block">
                            {findItem(menuItems, activeId)?.item?.title || 'Moving...'}
                          </span>
                          <span className="text-body-sm text-on-surface-variant block">
                            {findItem(menuItems, activeId)?.item?.url || ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>

              {menuItems.length === 0 ? (
                <div className="mt-8 border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center bg-surface-container-low/20">
                  <Layers size={48} className="text-on-surface-variant mb-4 opacity-50" />
                  <p className="text-body-lg text-on-surface-variant font-medium mb-2">
                    No menu items yet
                  </p>
                  <p className="text-body-md text-on-surface-variant max-w-[280px] mb-6">
                    Add your first menu item to get started building your navigation.
                  </p>
                  <Button
                    onClick={() => {
                      setParentId(null);
                      setEditingItem(null);
                      setShowModal(true);
                    }}
                    variant="text"
                    icon={<Plus size={18} />}
                  >
                    Add First Item
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </section>
          </div>
        </div>

       

        {/* Add/Edit Modal - FIXED */}
        <MenuItemModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
            setParentId(null);
          }}
          onSave={handleSaveItem}
          editingItem={editingItem}
          parentId={parentId}
        />
      </main>
    </>
  );
};

export default MenuEditorPage;