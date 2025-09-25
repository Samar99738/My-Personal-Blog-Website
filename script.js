// Sample blog posts data
let posts = [
    {
        id: "post1",
        title: "Welcome to My Blog!",
        date: "2025-09-25",
        content: "This is the first post on my personal blog. Stay tuned for more updates and stories!",
        comments: []
    },
    {
        id: "post2",
        title: "Why I Love Writing",
        date: "2025-09-20",
        content: "Writing helps me express my thoughts and connect with others. In this post, I share why writing is important to me.",
        comments: []
    },
    {
        id: "post3",
        title: "Tips for Productive Mornings",
        date: "2025-09-15",
        content: "Start your day with a clear plan, a healthy breakfast, and a positive mindset. Here are my top tips for productive mornings.",
        comments: []
    }
];
let filteredPosts = posts;
let currentPostIdx = null;
const POSTS_PER_PAGE = 10;
let currentPage = 1;

function renderPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    const startIdx = (currentPage - 1) * POSTS_PER_PAGE;
    const endIdx = startIdx + POSTS_PER_PAGE;
    const pagePosts = filteredPosts.slice(startIdx, endIdx);
    pagePosts.forEach((post, idx) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <h2 class="post-title">${post.title}</h2>
            <div class="post-date">${new Date(post.date).toLocaleDateString()}</div>
            <div class="post-content">${post.content}</div>
            <button class="comments-btn" data-idx="${startIdx + idx}">💬 Comments (${post.comments.length})</button>
            <button class="edit-post-btn" data-idx="${startIdx + idx}">Edit</button>
            <button class="delete-post-btn" data-idx="${startIdx + idx}">Delete</button>
        `;
        postDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('comments-btn')) return;
            if (e.target.classList.contains('edit-post-btn')) return;
            if (e.target.classList.contains('delete-post-btn')) return;
            showPostModal(startIdx + idx);
        });
        postDiv.querySelector('.comments-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showCommentsModal(startIdx + idx);
        });
        postDiv.querySelector('.edit-post-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            showEditPostModal(startIdx + idx);
        });
        postDiv.querySelector('.delete-post-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deletePost(startIdx + idx);
        });
        postsContainer.appendChild(postDiv);
    });
    renderPagination();
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    let html = '';
    if (currentPage > 1) {
        html += `<button class="page-btn" data-page="${currentPage - 1}">&laquo; Prev</button>`;
    }
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn${i === currentPage ? ' active' : ''}" data-page="${i}">${i}</button>`;
    }
    if (currentPage < totalPages) {
        html += `<button class="page-btn" data-page="${currentPage + 1}">Next &raquo;</button>`;
    }
    pagination.innerHTML = html;
    Array.from(pagination.querySelectorAll('.page-btn')).forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentPage = parseInt(btn.getAttribute('data-page'));
            renderPosts();
        });
    });
}

// Edit Post
let editPostIdx = null;
function showEditPostModal(idx) {
    const filteredPost = filteredPosts[idx];
    document.getElementById('edit-title').value = filteredPost.title;
    document.getElementById('edit-content').value = filteredPost.content;
    // Set hidden field for post id
    document.getElementById('edit-post-id').value = filteredPost.id;
    document.getElementById('edit-post-modal').style.display = 'block';
}
function closeEditPostModal() {
    document.getElementById('edit-post-modal').style.display = 'none';
}
function handleEditPost(e) {
    e.preventDefault();
    const title = document.getElementById('edit-title').value.trim();
    const content = document.getElementById('edit-content').value.trim();
    const idField = document.getElementById('edit-post-id');
    const id = idField ? idField.value : null;
    if (title && content && id) {
        const postIdx = posts.findIndex(p => p.id === id);
        if (postIdx !== -1) {
            posts[postIdx].title = title;
            posts[postIdx].content = content;
            savePosts();
            filteredPosts = posts;
            renderPosts();
            closeEditPostModal();
        } else {
        }
    } else {
        console.log('Missing title, content, or id');
    }
}
function deletePost(idx) {
    if (confirm('Are you sure you want to delete this post?')) {
        posts.splice(idx, 1);
        filteredPosts = posts;
        savePosts();
        renderPosts();
    }
}
function savePosts() {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}
function loadPosts() {
    const saved = localStorage.getItem('blogPosts');
    if (saved) {
        posts = JSON.parse(saved);
        // Ensure every post has a unique id
        posts.forEach((post, idx) => {
            if (!post.id) {
                post.id = 'post' + (idx + 1) + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
            }
        });
        filteredPosts = posts;
    }
}

function showPostModal(idx) {
    const post = filteredPosts[idx];
    currentPostIdx = idx;
    document.getElementById('modal-title').textContent = post.title;
    document.getElementById('modal-date').textContent = new Date(post.date).toLocaleDateString();
    document.getElementById('modal-content').textContent = post.content;
    document.getElementById('post-modal').style.display = 'block';
}
function closePostModal() {
    document.getElementById('post-modal').style.display = 'none';
}

// Search functionality
function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    );
    renderPosts();
}

// Add post functionality
function showAddPostModal() {
    document.getElementById('add-post-modal').style.display = 'block';
}
function closeAddPostModal() {
    document.getElementById('add-post-modal').style.display = 'none';
}
function handleAddPost(e) {
    e.preventDefault();
    const title = document.getElementById('new-title').value.trim();
    const content = document.getElementById('new-content').value.trim();
    if (title && content) {
        posts.unshift({ id: generateId(), title, content, date: new Date().toISOString(), comments: [] });
        filteredPosts = posts;
        savePosts();
        renderPosts();
        closeAddPostModal();
        e.target.reset();
    }
}

// Ensure each post has a unique id
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Comments functionality
function showCommentsModal(idx) {
    currentPostIdx = idx;
    renderComments(idx);
    document.getElementById('comments-modal').style.display = 'block';
}
function closeCommentsModal() {
    document.getElementById('comments-modal').style.display = 'none';
}
function renderComments(idx) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';
    const comments = filteredPosts[idx].comments || [];
    if (comments.length === 0) {
        commentsList.innerHTML = '<p>No comments yet.</p>';
    } else {
        comments.forEach((c, cIdx) => {
            const div = document.createElement('div');
            div.className = 'comment';
            div.innerHTML = `<strong>${c.author}</strong>: <span>${c.text}</span>
                <button class="edit-comment-btn" data-cidx="${cIdx}">Edit</button>
                <button class="delete-comment-btn" data-cidx="${cIdx}">Delete</button>`;
            div.querySelector('.edit-comment-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                showEditCommentModal(idx, cIdx);
            });
            div.querySelector('.delete-comment-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteComment(idx, cIdx);
            });
            commentsList.appendChild(div);
        });
    }
}

// Edit Comment
let editCommentPostIdx = null;
let editCommentIdx = null;
function showEditCommentModal(postIdx, cIdx) {
    editCommentPostIdx = postIdx;
    editCommentIdx = cIdx;
    const comment = filteredPosts[postIdx].comments[cIdx];
    document.getElementById('comment-author').value = comment.author;
    document.getElementById('comment-text').value = comment.text;
    document.getElementById('comment-form').onsubmit = handleEditComment;
}
function handleEditComment(e) {
    e.preventDefault();
    const author = document.getElementById('comment-author').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    if (author && text && editCommentPostIdx !== null && editCommentIdx !== null) {
        filteredPosts[editCommentPostIdx].comments[editCommentIdx] = { author, text };
        savePosts();
        renderComments(editCommentPostIdx);
        renderPosts();
        document.getElementById('comment-form').onsubmit = handleAddComment;
        document.getElementById('comment-form').reset();
        editCommentPostIdx = null;
        editCommentIdx = null;
    }
}
function deleteComment(postIdx, cIdx) {
    if (confirm('Are you sure you want to delete this comment?')) {
        filteredPosts[postIdx].comments.splice(cIdx, 1);
        savePosts();
        renderComments(postIdx);
        renderPosts();
    }
}

function setMode(mode) {
    document.body.classList.toggle('dark-mode', mode === 'dark');
    const switchBtn = document.getElementById('mode-switch');
    if (mode === 'dark') {
        switchBtn.textContent = '☀️';
    } else {
        switchBtn.textContent = '🌙';
    }
    localStorage.setItem('blogMode', mode);
}
function toggleMode() {
    const isDark = document.body.classList.contains('dark-mode');
    setMode(isDark ? 'light' : 'dark');
}

function handleAddComment(e) {
    e.preventDefault();
    const author = document.getElementById('comment-author').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    if (author && text && currentPostIdx !== null) {
        // Use unique id for post lookup
        const post = filteredPosts[currentPostIdx];
        const postIdx = posts.findIndex(p => p.id === post.id);
        if (postIdx !== -1) {
            posts[postIdx].comments.push({ author, text });
            savePosts();
            renderComments(currentPostIdx);
            renderPosts();
            e.target.reset();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    renderPosts();
    const savedMode = localStorage.getItem('blogMode') || 'light';
    setMode(savedMode);
    document.getElementById('mode-switch').addEventListener('click', toggleMode);
    document.getElementById('close-modal').addEventListener('click', closePostModal);
    window.onclick = function(event) {
        const modal = document.getElementById('post-modal');
        if (event.target === modal) {
            closePostModal();
        }
        const addModal = document.getElementById('add-post-modal');
        if (event.target === addModal) {
            closeAddPostModal();
        }
        const commentsModal = document.getElementById('comments-modal');
        if (event.target === commentsModal) {
            closeCommentsModal();
        }
        const editModal = document.getElementById('edit-post-modal');
        if (event.target === editModal) {
            closeEditPostModal();
        }
    };
    document.getElementById('search-input').addEventListener('input', handleSearch);
    document.getElementById('add-post-btn').addEventListener('click', showAddPostModal);
    document.getElementById('close-add-modal').addEventListener('click', closeAddPostModal);
    document.getElementById('add-post-form').addEventListener('submit', handleAddPost);
    document.getElementById('close-comments-modal').addEventListener('click', closeCommentsModal);
    document.getElementById('comment-form').addEventListener('submit', handleAddComment);
    document.getElementById('close-edit-modal').addEventListener('click', closeEditPostModal);
    // Always re-attach the submit event for edit form
    document.getElementById('edit-post-form').onsubmit = handleEditPost;
});