// LocalStorage keys
const ENTRIES_KEY = 'diary_entries';
const DIARIES_KEY = 'diaries_list';

// Initialize entries from localStorage
let entries = JSON.parse(localStorage.getItem(ENTRIES_KEY)) || [
    {
        id: 1,
        title: "A Peaceful Day in Nature",
        content: "Today I went for a walk in the forest. The gentle breeze through the trees reminded me of a Ghibli film. I saw a little cat by the stream, and it made me think of Totoro. The world feels so magical when you slow down and really look at it.",
        mood: "😊",
        date: new Date('2026-02-04').toISOString()
    },
    {
        id: 2,
        title: "Dreams and Tea",
        content: "I made some chamomile tea this afternoon and sat by the window. The rain was falling gently, creating patterns on the glass. I thought about my dreams and where I want to go. Sometimes the quiet moments are the most precious.",
        mood: "🥰",
        date: new Date('2026-02-03').toISOString()
    }
];

// Save entries to localStorage
function saveEntries() {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

// Modal functions
function showCreateModal() {
    document.getElementById('createModal').style.display = 'flex';
}

function hideCreateModal() {
    document.getElementById('createModal').style.display = 'none';
}

function showEntryModal() {
    document.getElementById('entryModal').style.display = 'flex';
}

function hideEntryModal() {
    document.getElementById('entryModal').style.display = 'none';
}

function showEditModal(index) {
    const entry = entries[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('editEntryTitle').value = entry.title;
    document.getElementById('editEntryContent').value = entry.content;
    
    // Set mood radio button
    const moodRadios = document.querySelectorAll('#edit-mood-selector input[type="radio"]');
    moodRadios.forEach(radio => {
        if (radio.value === entry.mood) {
            radio.checked = true;
        }
    });
    
    document.getElementById('editModal').style.display = 'flex';
}

function hideEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Create new diary
function createDiary(event) {
    event.preventDefault();
    const title = document.getElementById('diaryTitle').value;
    alert(`Diary "${title}" created! (This is a demo - full functionality requires backend)`);
    hideCreateModal();
    document.getElementById('diaryTitle').value = '';
}

// Add new entry
function addEntry(event) {
    event.preventDefault();
    
    const title = document.getElementById('entryTitle').value;
    const content = document.getElementById('entryContent').value;
    const mood = document.querySelector('input[name="mood"]:checked').value;
    
    const newEntry = {
        id: entries.length + 1,
        title: title,
        content: content,
        mood: mood,
        date: new Date().toISOString()
    };
    
    entries.unshift(newEntry);
    saveEntries();
    renderEntries();
    
    // Reset form
    document.getElementById('entryTitle').value = '';
    document.getElementById('entryContent').value = '';
    hideEntryModal();
}

// Update entry
function updateEntry(event) {
    event.preventDefault();
    
    const index = parseInt(document.getElementById('editIndex').value);
    const title = document.getElementById('editEntryTitle').value;
    const content = document.getElementById('editEntryContent').value;
    const mood = document.querySelector('input[name="editMood"]:checked').value;
    
    entries[index].title = title;
    entries[index].content = content;
    entries[index].mood = mood;
    
    saveEntries();
    renderEntries();
    hideEditModal();
}

// Delete entry
function deleteEntry(index) {
    if (confirm('Delete this entry?')) {
        entries.splice(index, 1);
        saveEntries();
        renderEntries();
    }
}

// Render entries on diary page
function renderEntries() {
    const container = document.getElementById('entriesContainer');
    if (!container) return;
    
    if (entries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h2>No entries yet</h2>
                <p>Start writing your first diary entry!</p>
                <button class="btn-new-entry" onclick="showEntryModal()">Create Entry</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = entries.map((entry, index) => {
        const date = new Date(entry.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        return `
            <div class="entry-card">
                <div class="entry-header">
                    <div class="entry-date">${formattedDate}</div>
                    <div class="entry-actions">
                        <button class="edit-btn" onclick="showEditModal(${index})">✏️</button>
                        <button class="delete-btn" onclick="deleteEntry(${index})">🗑️</button>
                    </div>
                </div>
                
                <div class="entry-decorations">
                    <span class="deco-item">✨</span>
                    <span class="deco-item">🌸</span>
                    <span class="deco-item">⭐</span>
                    <span class="deco-item">🦋</span>
                </div>
                
                <div class="entry-content-wrapper">
                    <div class="entry-mood">${entry.mood}</div>
                    <h2 class="entry-title">${escapeHtml(entry.title)}</h2>
                    <div class="entry-content">${escapeHtml(entry.content)}</div>
                </div>
                
                <div class="entry-footer">
                    <div class="author-info">
                        <span class="author-icon">🐰</span>
                        <span class="author-text">hi sweeties this is me</span>
                    </div>
                    <div class="made-with-love">made with love ˚ˑ༄ؘ ·˚</div>
                </div>
            </div>
        `;
    }).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modal when clicking outside
window.onclick = function(event) {
    const createModal = document.getElementById('createModal');
    const entryModal = document.getElementById('entryModal');
    const editModal = document.getElementById('editModal');
    
    if (event.target === createModal) {
        hideCreateModal();
    }
    if (event.target === entryModal) {
        hideEntryModal();
    }
    if (event.target === editModal) {
        hideEditModal();
    }
}

// Render entries when page loads
document.addEventListener('DOMContentLoaded', function() {
    renderEntries();
});