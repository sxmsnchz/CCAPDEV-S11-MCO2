async function getServerSession() {
    try {
        const res = await fetch("/session");
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch session:", error);
        return {
            isLoggedIn: false,
            userType: null,
            user: null
        };
    }
}

// =========================
// ORG PAGE
// =========================
document.addEventListener("DOMContentLoaded", async () => {
    const session = await getServerSession();

    const isLoggedIn = session.isLoggedIn;
    const userRole = session.userType;
    const currentUser = session.user?.id || null;

    const pageOrg = document.body.dataset.org;

    const isOrgOwner =
        userRole === "organization" &&
        session.user.email === pageOrg;

    const canManagePosts =
        userRole === "admin" || isOrgOwner;

    let displayName = "Guest";

    if (isLoggedIn && session.user) {
        if (userRole === "student") {
            displayName = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim();
        } else if (userRole === "organization") {
            displayName = session.user.orgName || "Organization";
        } else if (userRole === "admin") {
            displayName = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim();
        }
    }

    document.querySelectorAll(".org-post").forEach(post => {
        const addCommentBox = post.querySelector(".add-comment");
        const warning = post.querySelector(".login-warning");

        if (isLoggedIn) {
            addCommentBox?.classList.remove("hidden");
            warning?.classList.add("hidden");
        } else {
            addCommentBox?.classList.add("hidden");
            warning?.classList.remove("hidden");
        }
    });

    // ===== EDIT COMMENT FUNCTIONALITY =====
    document.querySelectorAll(".edit-comment-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const comment = btn.closest(".comment");
            const text = comment.querySelector(".comment-text");
            const form = comment.querySelector(".edit-comment-form");
            const editBtn = btn;

            // Hide the edit button in the dropdown temporarily
            if (editBtn) {
                editBtn.style.display = 'none';
            }

            text.classList.add("hidden");
            form.classList.remove("hidden");
        });
    });

    // ===== ADD COMMENT WITHOUT RELOAD =====  👈 ADD THIS HERE
    document.querySelectorAll('.submit-comment').forEach(btn => {
        // Remove existing listeners to avoid duplicates
        btn.replaceWith(btn.cloneNode(true));
    });

    document.querySelectorAll('.submit-comment').forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const form = this.closest('form');
            const textarea = form.querySelector('.comment-input');
            const text = textarea.value.trim();
            const postId = form.querySelector('input[name="postId"]').value;
            const page = form.querySelector('input[name="page"]').value;
            
            if (!text) {
                alert('Please write a comment');
                return;
            }
            
            // Disable button to prevent double submission
            this.disabled = true;
            this.textContent = 'Posting...';
            
            try {
                const response = await fetch('/add-comment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        text: text,
                        page: page,
                        postId: postId
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Clear the textarea
                    textarea.value = '';
                    
                    // Create new comment element and add to DOM
                    const commentsDiv = form.closest('.comments');
                    const newComment = createCommentElement(data.comment, data.user);
                    commentsDiv.insertBefore(newComment, form);
                    
                    // Update comment count
                    const commentToggle = commentsDiv.closest('.org-post').querySelector('.comment-toggle');
                    const currentText = commentToggle.textContent;
                    const match = currentText.match(/\d+/);
                    const currentCount = match ? parseInt(match[0]) : 0;
                    commentToggle.textContent = `View comments (${currentCount + 1})`;
                    
                    console.log('Comment added successfully');
                } else {
                    const error = await response.json();
                    alert('Failed to add comment: ' + (error.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error adding comment');
            } finally {
                // Re-enable button
                this.disabled = false;
                this.textContent = 'Post';
            }
        });
    });

    // Helper functions for comments  👈 ADD THESE RIGHT AFTER
    function createCommentElement(commentData, userData) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.dataset.owner = userData.id;
        
        const displayName = userData.name || 'User';
        
        commentDiv.innerHTML = `
            <div class="comment-header">
                <strong>${displayName}</strong>
                <div class="comment-menu-container">
                    <button class="comment-menu-trigger">⋮</button>
                    <div class="comment-dropdown-menu">
                        <button class="edit-comment-btn">Edit</button>
                        <form action="/delete-comment/${commentData._id}" method="POST">
                            <button type="submit" class="delete-comment-btn">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
            <p class="comment-text">${commentData.text}</p>
            <form action="/edit-comment/${commentData._id}" method="POST" class="edit-comment-form hidden">
                <input type="text" name="text" value="${commentData.text}" required>
                <div class="comment-edit-actions">
                    <button type="submit" class="save-comment-btn">Save</button>
                    <button type="button" class="cancel-comment-edit-btn">Cancel</button>
                </div>
            </form>
        `;
        
        // Attach event listeners to new comment
        attachCommentListeners(commentDiv);
        
        return commentDiv;
    }

    function attachCommentListeners(commentDiv) {
        // Edit button in dropdown
        const editBtn = commentDiv.querySelector('.edit-comment-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const textP = commentDiv.querySelector('.comment-text');
                const form = commentDiv.querySelector('.edit-comment-form');
                textP.classList.add('hidden');
                form.classList.remove('hidden');
            });
        }
        
        // Cancel button
        const cancelBtn = commentDiv.querySelector('.cancel-comment-edit-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const textP = commentDiv.querySelector('.comment-text');
                const form = commentDiv.querySelector('.edit-comment-form');
                textP.classList.remove('hidden');
                form.classList.add('hidden');
            });
        }
        
        // Edit form submission
        const editForm = commentDiv.querySelector('.edit-comment-form');
        if (editForm) {
            editForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const textP = commentDiv.querySelector('.comment-text');
                const input = editForm.querySelector('input');
                const newText = input.value.trim();
                
                if (!newText) {
                    alert("Comment cannot be empty");
                    return;
                }
                
                try {
                    const response = await fetch(editForm.action, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({ text: newText })
                    });
                    
                    if (response.ok) {
                        textP.textContent = newText;
                        textP.classList.remove('hidden');
                        editForm.classList.add('hidden');
                    } else {
                        alert('Failed to update comment');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error updating comment');
                }
            });
        }
        
        // Menu toggle
        const menuTrigger = commentDiv.querySelector('.comment-menu-trigger');
        if (menuTrigger) {
            menuTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const menu = menuTrigger.nextElementSibling;
                document.querySelectorAll('.comment-dropdown-menu').forEach(m => {
                    if (m !== menu) m.style.display = 'none';
                });
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });
        }
    }

    // Cancel comment edit
    document.querySelectorAll(".cancel-comment-edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const comment = btn.closest(".comment");
            const text = comment.querySelector(".comment-text");
            const form = comment.querySelector(".edit-comment-form");
            const editBtn = comment.querySelector(".edit-comment-btn");

            // Show the edit button again
            if (editBtn) {
                editBtn.style.display = 'block';
            }

            text.classList.remove("hidden");
            form.classList.add("hidden");
        });
    });

    // Handle comment edit form submission without page reload
    document.querySelectorAll(".edit-comment-form").forEach(form => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const comment = form.closest(".comment");
            const textP = comment.querySelector(".comment-text");
            const editBtn = comment.querySelector(".edit-comment-btn");
            const input = form.querySelector('input[name="text"]');
            const newText = input.value.trim();
            
            if (!newText) {
                alert("Comment cannot be empty");
                return;
            }

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: newText })
                });

                if (response.ok) {
                    // Update the comment text in the DOM
                    textP.textContent = newText;
                    
                    // Show the edit button again
                    if (editBtn) {
                        editBtn.style.display = 'block';
                    }
                    
                    // Hide form, show text
                    textP.classList.remove("hidden");
                    form.classList.add("hidden");
                    
                    console.log('Comment updated successfully');
                } else {
                    alert('Failed to update comment');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating comment');
            }
        });
    });

    // ===== LIKE BUTTON FUNCTIONALITY =====
    document.querySelectorAll('.like-btn').forEach(function(button) {
        // Set initial liked state
        const likedByUser = button.dataset.likedByUser === 'true';
        if (likedByUser) {
            button.style.background = 'rgba(4, 99, 7, 0.1)';
        }
        
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            const postId = this.dataset.postId;
            const likeCountSpan = this.querySelector('.like-count');
            
            try {
                const response = await fetch('/posts/like/' + postId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Server error');
                }
                
                const data = await response.json();
                likeCountSpan.textContent = data.likes;
                
                // Toggle liked state visually
                if (data.liked) {
                    this.style.background = 'rgba(4, 99, 7, 0.1)';
                } else {
                    this.style.background = 'none';
                }
                
            } catch (error) {
                console.error('Error liking post:', error);
            }
        });
    });

    
    // Lightbox
    const lightbox = document.getElementById("js-lightbox");
    const lightboxImg = lightbox?.querySelector("img");
    const closeLightbox = lightbox?.querySelector(".js-lightbox-close");

    function attachLightbox(img) {
        img.addEventListener("click", () => {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightbox.classList.remove("hidden");
        });
    }

    document.querySelectorAll(".lightbox-trigger").forEach(attachLightbox);

    closeLightbox?.addEventListener("click", () => {
        lightbox.classList.add("hidden");
        if (lightboxImg) lightboxImg.src = "";
    });

    lightbox?.addEventListener("click", e => {
        if (e.target === lightbox) {
            lightbox.classList.add("hidden");
            if (lightboxImg) lightboxImg.src = "";
        }
    });

    // ===== CREATE POST FUNCTIONALITY - MUST COME FIRST =====
    const createBtn = document.getElementById("create-post-btn");
    const modal = document.getElementById("create-post-modal");
    const submitPost = document.getElementById("submit-post");
    const cancelPost = document.getElementById("cancel-post");

    const titleInput = document.getElementById("new-post-title");
    const contentInput = document.getElementById("new-post-content");
    const imageInput = document.getElementById("new-post-image");

    const postsContainer = document.querySelector(".org-posts");

    console.log('Create button found:', createBtn); // Debug

    // ===== IMAGE SELECTOR FUNCTIONALITY =====
    const imageSelectorModal = document.getElementById("image-selector-modal");
    const selectImageBtn = document.getElementById("select-image-btn");
    const closeImageSelector = document.getElementById("close-image-selector");
    const imageGrid = document.querySelector(".image-grid");
    const selectedImageName = document.getElementById("selected-image-name");
    const newPostImage = document.getElementById("new-post-image");
    const imagePreview = document.getElementById("image-preview");
    const previewImg = imagePreview?.querySelector("img");
    const removeImageBtn = document.getElementById("remove-image-btn");

    // ===== DROPDOWN MENU FUNCTIONALITY =====
    // Close all dropdowns when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!e.target.classList.contains('post-menu-trigger') && !e.target.classList.contains('comment-menu-trigger')) {
            document.querySelectorAll('.post-dropdown-menu, .comment-dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });

    // Post menu toggle
    document.querySelectorAll('.post-menu-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = this.nextElementSibling;
            // Close other menus
            document.querySelectorAll('.post-dropdown-menu, .comment-dropdown-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            // Toggle this menu
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Comment menu toggle
    document.querySelectorAll('.comment-menu-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = this.nextElementSibling;
            // Close other menus
            document.querySelectorAll('.post-dropdown-menu, .comment-dropdown-menu').forEach(m => {
                if (m !== menu) m.style.display = 'none';
            });
            // Toggle this menu
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    // List of images in your assets folder
    const availableImages = [
        { name: "AU Logo", path: "/assets/au_logo1.png" },
        { name: "AU 2nd GA", path: "/assets/AU_2ndGA.jpg" },
        { name: "AU WCD", path: "/assets/AU_WCD.jpg" },
        { name: "AU MAUgic", path: "/assets/AU_MAUgic.jpg" },
        { name: "AU Highlight 1", path: "/assets/AU1.jpg" },
        { name: "AU Highlight 2", path: "/assets/AU2.jpg" },
        { name: "AU Highlight 3", path: "/assets/AU3.jpg" }
    ];

    // Open image selector
    selectImageBtn?.addEventListener("click", () => {
        // Populate image grid
        imageGrid.innerHTML = "";
        availableImages.forEach(img => {
            const imgDiv = document.createElement("div");
            imgDiv.className = "image-option";
            imgDiv.style.cssText = "cursor: pointer; border: 2px solid transparent; border-radius: 8px; overflow: hidden; transition: all 0.2s;";
            imgDiv.innerHTML = `
                <img src="${img.path}" alt="${img.name}" style="width: 100%; height: 120px; object-fit: cover;">
                <p style="text-align: center; margin: 5px 0; font-size: 0.9rem;">${img.name}</p>
            `;
            
            imgDiv.addEventListener("click", () => {
                // Select this image
                newPostImage.value = img.path;
                selectedImageName.textContent = img.name;
                
                // Show preview
                previewImg.src = img.path;
                imagePreview.style.display = "block";
                
                // Close selector
                imageSelectorModal.classList.add("hidden");
            });
            
            imageGrid.appendChild(imgDiv);
        });
        
        imageSelectorModal.classList.remove("hidden");
    });

    // Close image selector
    closeImageSelector?.addEventListener("click", () => {
        imageSelectorModal.classList.add("hidden");
    });

    // Remove selected image
    removeImageBtn?.addEventListener("click", () => {
        newPostImage.value = "";
        selectedImageName.textContent = "No image selected";
        imagePreview.style.display = "none";
        previewImg.src = "";
    });

    // Click outside to close
    imageSelectorModal?.addEventListener("click", (e) => {
        if (e.target === imageSelectorModal) {
            imageSelectorModal.classList.add("hidden");
        }
    });

    // ===== EDIT IMAGE SELECTOR FUNCTIONALITY =====
    const editImageInput = document.getElementById("edit-image");
    const editImageSelectorBtn = document.createElement("button");
    editImageSelectorBtn.type = "button";
    editImageSelectorBtn.id = "edit-select-image-btn";
    editImageSelectorBtn.className = "btn-secondary";
    editImageSelectorBtn.textContent = "Choose Image";
    editImageSelectorBtn.style.marginBottom = "10px";

    // Insert the button before the edit image input
    if (editImageInput && editImageInput.parentNode) {
        editImageInput.parentNode.insertBefore(editImageSelectorBtn, editImageInput);
    }

    // Create a hidden input to store selected image path
    const editSelectedImagePath = document.createElement("input");
    editSelectedImagePath.type = "hidden";
    editSelectedImagePath.id = "edit-selected-image";
    if (editImageInput && editImageInput.parentNode) {
        editImageInput.parentNode.insertBefore(editSelectedImagePath, editImageInput.nextSibling);
    }

    // Preview for edit modal
    const editPreviewDiv = document.createElement("div");
    editPreviewDiv.id = "edit-image-preview";
    editPreviewDiv.style.display = "none";
    editPreviewDiv.style.marginTop = "10px";
    editPreviewDiv.innerHTML = `
        <img src="" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
        <button type="button" id="edit-remove-image-btn" class="btn-small" style="margin-top: 5px; background: #ff4444; color: white; border: none; border-radius: 4px; padding: 4px 12px; cursor: pointer;">Remove</button>
    `;

    if (editImageInput && editImageInput.parentNode) {
        editImageInput.parentNode.insertBefore(editPreviewDiv, editImageInput.nextSibling);
    }

    // Edit image selector click
    document.getElementById("edit-select-image-btn")?.addEventListener("click", () => {
        // Populate image grid
        const editImageGrid = document.querySelector(".image-grid");
        if (!editImageGrid) return;
        
        editImageGrid.innerHTML = "";
        availableImages.forEach(img => {
            const imgDiv = document.createElement("div");
            imgDiv.className = "image-option";
            imgDiv.style.cssText = "cursor: pointer; border: 2px solid transparent; border-radius: 8px; overflow: hidden; transition: all 0.2s;";
            imgDiv.innerHTML = `
                <img src="${img.path}" alt="${img.name}" style="width: 100%; height: 120px; object-fit: cover;">
                <p style="text-align: center; margin: 5px 0; font-size: 0.9rem;">${img.name}</p>
            `;
            
            imgDiv.addEventListener("click", () => {
                // Select this image
                editImageInput.value = img.path;
                editSelectedImagePath.value = img.path;
                
                // Show preview
                const previewImg = editPreviewDiv.querySelector("img");
                previewImg.src = img.path;
                editPreviewDiv.style.display = "block";
                
                // Close selector
                imageSelectorModal.classList.add("hidden");
            });
            
            editImageGrid.appendChild(imgDiv);
        });
        
        imageSelectorModal.classList.remove("hidden");
    });

    // Edit remove image button
    document.getElementById("edit-remove-image-btn")?.addEventListener("click", () => {
        editImageInput.value = "";
        editSelectedImagePath.value = "";
        editPreviewDiv.style.display = "none";
    });

    // When opening edit modal, sync the image input
    const originalShowEditPostModal = window.showEditPostModal;
    window.showEditPostModal = function(postId) {
        // Call original function first
        originalShowEditPostModal(postId);
        
        // Then set up the image preview
        setTimeout(() => {
            const imageUrl = editImageInput.value;
            if (imageUrl) {
                const previewImg = editPreviewDiv.querySelector("img");
                previewImg.src = imageUrl;
                editPreviewDiv.style.display = "block";
            }
        }, 100);
    };

    // ===== EDIT POST MODAL FUNCTION =====
    window.showEditPostModal = function(postId) {
        console.log('Opening edit modal for post:', postId);
        
        const modal = document.getElementById('edit-post-modal');
        const postCard = document.getElementById('post-' + postId);
        
        if (!postCard) {
            console.error('Post card not found:', postId);
            return;
        }
        
        // Get post data from the DOM
        const titleEl = postCard.querySelector('h3');
        const contentEl = postCard.querySelector('.post-content');
        const imageEl = postCard.querySelector('.post-image');
        
        const title = titleEl ? titleEl.textContent : '';
        let content = '';
        if (contentEl) {
            content = contentEl.textContent || contentEl.innerText || '';
            content = content.trim();
        }       
        const image = imageEl ? imageEl.src : '';
        
        // Set the post ID in hidden field
        document.getElementById('edit-post-id').value = postId;
        
        // Fill in the form
        document.getElementById('edit-title').value = title;
        document.getElementById('edit-content').value = content;
        document.getElementById('edit-image').value = image || '';
        
        // Show modal
        modal.classList.remove('hidden');
    };

    // ===== HANDLE EDIT FORM SUBMISSION =====
    const editForm = document.getElementById('edit-post-form');
    if (editForm) {
        // Remove any existing listeners
        const newForm = editForm.cloneNode(true);
        editForm.parentNode.replaceChild(newForm, editForm);
        
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const postId = document.getElementById('edit-post-id').value;
            const title = document.getElementById('edit-title').value.trim();
            const content = document.getElementById('edit-content').value.trim();
            const image = document.getElementById('edit-image').value.trim();
            const orgName = this.querySelector('input[name="orgName"]').value;
            
            if (!title || !content) {
                alert('Title and content are required.');
                return;
            }
            
            // Disable submit button
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
            
            try {
                const response = await fetch('/posts/edit/' + postId, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        title: title,
                        content: content,
                        image: image,
                        orgName: orgName
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Update the post in the DOM
                    const postCard = document.getElementById('post-' + postId);
                    if (postCard) {
                        // Update title
                        const titleEl = postCard.querySelector('h3');
                        if (titleEl) titleEl.textContent = data.post.title;
                        
                        // Update content (preserve line breaks)
                        const contentEl = postCard.querySelector('.post-content');
                        if (contentEl) {
                            contentEl.innerHTML = data.post.content.replace(/\n/g, '<br>');
                        }
                        
                        // Update image
                        const imageEl = postCard.querySelector('.post-image');
                        if (data.post.image) {
                            if (imageEl) {
                                imageEl.src = data.post.image;
                            } else if (postCard.firstChild) {
                                // Insert image at the beginning
                                const newImage = document.createElement('img');
                                newImage.src = data.post.image;
                                newImage.alt = data.post.title;
                                newImage.className = 'post-image lightbox-trigger';
                                postCard.insertBefore(newImage, postCard.firstChild);
                                
                                // Attach lightbox
                                const lightbox = document.getElementById("js-lightbox");
                                if (lightbox) {
                                    newImage.addEventListener('click', () => {
                                        lightbox.classList.remove("hidden");
                                        lightbox.querySelector("img").src = newImage.src;
                                    });
                                }
                            }
                        } else if (imageEl) {
                            // Remove image if it exists and new image is empty
                            imageEl.remove();
                        }
                    }
                    
                    // Close modal
                    document.getElementById('edit-post-modal').classList.add('hidden');
                    console.log('Post updated successfully');
                } else {
                    const error = await response.json();
                    alert('Failed to update post: ' + (error.error || 'Unknown error'));
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error updating post. Please try again.');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Cancel edit button
    const cancelEdit = document.getElementById('cancel-edit');
    if (cancelEdit) {
        cancelEdit.addEventListener('click', function() {
            const modal = document.getElementById('edit-post-modal');
            modal.classList.add('hidden');
            
            // Reset any posts that might be in edit mode
            document.querySelectorAll('.post-content.editing').forEach(el => {
                el.classList.remove('editing');
                el.contentEditable = false;
            });
            
            // Reset any edit buttons that might say "Save"
            document.querySelectorAll('.edit-post-btn').forEach(btn => {
                if (btn.textContent === 'Save') {
                    btn.textContent = 'Edit';
                }
            });
        });
    }

    // Also update the click outside to close modal
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('edit-post-modal');
        if (event.target === modal) {
            modal.classList.add('hidden');
            
            // Reset any posts that might be in edit mode
            document.querySelectorAll('.post-content.editing').forEach(el => {
                el.classList.remove('editing');
                el.contentEditable = false;
            });
            
            // Reset any edit buttons that might say "Save"
            document.querySelectorAll('.edit-post-btn').forEach(btn => {
                if (btn.textContent === 'Save') {
                    btn.textContent = 'Edit';
                }
            });
        }
    });

    // Post visibility
    document.querySelectorAll(".org-post").forEach(post => {
        const actions = post.querySelector(".post-actions");
        if (!actions) return;

        actions.classList.add("hidden");

        if (canManagePosts) {
            actions.classList.remove("hidden");
        }
    });

    // ===== CREATE POST BUTTON VISIBILITY =====
    if (canManagePosts) {
        if (createBtn) {
            createBtn.classList.remove("hidden");
            console.log('Create button should now be visible');
        } else {
            console.log('Create button not found in DOM');
        }
    }

    // ===== APPLY POST LOGIC FUNCTION =====
    function applyPostLogic(post) {
        const deleteBtn = post.querySelector(".delete-post-btn");
        const actions = post.querySelector(".post-actions");
        const content = post.querySelector(".post-content");

        if (content) {
            content.classList.add("clamp");

            const existingViewMoreBtn = post.querySelector(".view-more-btn");
            if (!existingViewMoreBtn) {
                const viewMoreBtn = document.createElement("button");
                viewMoreBtn.className = "view-more-btn";
                viewMoreBtn.textContent = "See more";

                const commentToggle = post.querySelector(".comment-toggle");

                if (commentToggle) {
                    post.insertBefore(viewMoreBtn, commentToggle);
                } else {
                    content.after(viewMoreBtn);
                }

                viewMoreBtn.addEventListener("click", () => {
                    const isExpanded = content.classList.contains("expanded");

                    content.classList.toggle("expanded");
                    content.classList.toggle("clamp");

                    viewMoreBtn.textContent = isExpanded ? "See more" : "See less";
                });

                setTimeout(() => {
                    if (content.scrollHeight <= content.clientHeight) {
                        viewMoreBtn.style.display = "none";
                    }
                }, 50);
            }
        }

        if (!canManagePosts) {
            actions?.classList.add("hidden");
        }

        // Delete post functionality
        if (deleteBtn) {
            // Remove existing listeners to avoid duplicates
            const newDeleteBtn = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
            
            newDeleteBtn.addEventListener("click", function(e) {
                e.preventDefault();
                if (confirm("Delete this post?")) {
                    const postId = post.id.replace('post-', '');
                    
                    fetch('/posts/delete/' + postId, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            orgName: 'Archers for UNICEF'
                        })
                    })
                    .then(response => {
                        if (response.ok) {
                            post.remove();
                        } else {
                            alert('Failed to delete post');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('Error deleting post');
                    });
                }
            });
        }

        const toggle = post.querySelector(".comment-toggle");
        const comments = post.querySelector(".comments");

        toggle?.addEventListener("click", () => {
            comments.classList.toggle("hidden");
            toggle.textContent = comments.classList.contains("hidden")
                ? "View comments"
                : "Hide comments";
        });
    }

    document.querySelectorAll(".org-post").forEach(applyPostLogic);

    if (canManagePosts) {
        if (createBtn) {
            createBtn.classList.remove("hidden");
            console.log('Create button should now be visible');
        } else {
            console.log('Create button not found in DOM');
        }
    }

    createBtn?.addEventListener("click", () => {
        modal?.classList.remove("hidden");
    });

    cancelPost?.addEventListener("click", () => {
        modal?.classList.add("hidden");
        if (titleInput) titleInput.value = "";
        if (contentInput) contentInput.value = "";
        if (imageInput) imageInput.value = "";
    });

    submitPost?.addEventListener("click", () => {
        const title = titleInput?.value.trim();
        const content = contentInput?.value.trim();
        const imageUrl = imageInput?.value.trim(); // Get the URL instead of file

        if (!title || !content) {
            alert("Title and content are required.");
            return;
        }

        // Disable button to prevent double submission
        submitPost.disabled = true;
        submitPost.textContent = 'Creating...';

        // Send as JSON
        fetch('/posts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content,
                image: imageUrl || "", // Use the URL directly, empty string if none
                orgName: 'Archers for UNICEF'
            })
        })
        .then(response => {
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    if (data.success) {
                        // Clear the form
                        titleInput.value = "";
                        contentInput.value = "";
                        imageInput.value = "";
                        modal?.classList.add("hidden");
                        // Reload to show the new post
                        window.location.reload();
                    } else {
                        alert('Error creating post: ' + (data.error || 'Unknown error'));
                    }
                });
            } else {
                // If not JSON, it was a redirect - success!
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create post. Please try again.');
        })
        .finally(() => {
            // Re-enable the submit button
            submitPost.disabled = false;
            submitPost.textContent = 'Post';
        });
    });

    function createPost(imageSrc, title, content) {
        if (!postsContainer) return;

        // Send to server first
        fetch('/posts/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content,
                image: imageSrc,
                orgName: 'Archers for UNICEF'
            })
        })
        .then(response => {
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json().then(data => {
                    if (data.success) {
                        window.location.reload();
                    } else {
                        alert('Error creating post: ' + (data.error || 'Unknown error'));
                    }
                });
            } else {
                // If not JSON, it's probably a redirect - success!
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to create post. Please try again.');
        })
        .finally(() => {
            // Re-enable the submit button
            if (submitPost) {
                submitPost.disabled = false;
                submitPost.textContent = 'Post';
            }
        });
    }
});

// =========================
// MENU
// =========================
const profileBtn = document.getElementById("profileBtn");
const profileDropdown = document.getElementById("profileDropdown");
const profileMenu = document.getElementById("profileMenu");

function renderProfileMenu() {
    if (!profileDropdown) return;

    profileDropdown.innerHTML = "";

    fetch("/session")
        .then(res => res.json())
        .then(session => {
            if (session.isLoggedIn) {
                profileDropdown.innerHTML = `
                    <li><button type="button" id="profBtn">Profile</button></li>
                    <li><button type="button" id="signOutBtn">Sign Out</button></li>
                `;

                document.getElementById("profBtn")?.addEventListener("click", () => {
                    switch (session.userType) {
                        case "student":
                            window.location.href = "/profile-student";
                            break;
                        case "organization":
                            window.location.href = "/profile-organization";
                            break;
                        case "admin":
                            window.location.href = "/profile-admin";
                            break;
                        default:
                            window.location.href = "/";
                    }
                });

                document.getElementById("signOutBtn")?.addEventListener("click", () => {
                    closeProfileDropdown();
                    window.location.href = "/logout";
                });
            } else {
                profileDropdown.innerHTML = `
                    <li><a href="/login">Sign In</a></li>
                `;
            }
        })
        .catch(error => {
            console.error("Session check error:", error);
        });
}

function toggleProfileDropdown() {
    profileDropdown?.classList.toggle("open");
}

function closeProfileDropdown() {
    profileDropdown?.classList.remove("open");
}

profileBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleProfileDropdown();
});

document.addEventListener("click", (e) => {
    if (!profileMenu?.contains(e.target)) {
        closeProfileDropdown();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeProfileDropdown();
    }
});

renderProfileMenu();

const orgLink = document.querySelector('a[href="#organizations"]');
const orgSection = document.getElementById("organizations");

if (orgLink && orgSection) {
    orgLink.addEventListener("click", (e) => {
        e.preventDefault();
        orgSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

// =========================
// REVIEWS PAGE
// =========================
document.addEventListener("DOMContentLoaded", async () => {
    class Review {
        constructor(user, rating, comment, date = null) {
            this.user = user;
            this.rating = rating;
            this.comment = comment;
            this.date = date ? date : new Date().toLocaleDateString();
        }
    }

    const session = await getServerSession();
    const isLoggedIn = session.isLoggedIn;
    const reviewsContainer = document.getElementById("reviewsContainer");
    const loginWarning = document.getElementById("reviewsLoginWarning");

    if (!reviewsContainer && !loginWarning) return;

    if (!isLoggedIn) {
        reviewsContainer?.classList.add("hidden");
        loginWarning?.classList.remove("hidden");
    } else {
        reviewsContainer?.classList.remove("hidden");
        loginWarning?.classList.add("hidden");
    }

    let reviewUserName = null;

    if (isLoggedIn && session.user) {
        if (session.userType === "student") {
            reviewUserName = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim();
        } else if (session.userType === "organization") {
            reviewUserName = session.user.orgName || "Organization";
        } else if (session.userType === "admin") {
            reviewUserName = `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim();
        }
    }

    let selectedRating = 0;
    let reviews = [];
    let rawReviews = []; // stores raw DB docs so we have access to _id for edit/delete

    // Map the current page url to its specific org
    const pageMap = {
        "/reviews1": "org1",
        "/reviews2": "org2",
        "/reviews3": "org3",
        "/reviews4": "org4",
        "/reviews5": "org5"
    };
    const org = pageMap[window.location.pathname];

    // Gets from databse and converts to objects
    async function loadReviews() {
        const res = await fetch(`/reviews/${org}`);
        const data = await res.json();
        rawReviews = data; // save raw docs for _id access
        reviews = data.map(r => new Review(
            r.user?.firstName ? `${r.user.firstName} ${r.user.lastName}`.trim() : r.user?.orgName || "User",
            r.rating,
            r.comment,
            new Date(r.createdAt).toLocaleDateString()
        ));
        renderReviews();
    }

    let currentFilter = "all";

    const stars = document.querySelectorAll("#starRating span");
    const reviewText = document.getElementById("reviewText");
    const reviewsList = document.getElementById("reviewsList");
    const currentUserEl = document.getElementById("currentUser");

    if (currentUserEl) {
        currentUserEl.textContent = isLoggedIn && reviewUserName ? reviewUserName : "Guest";
    }

    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = star.dataset.value;
            updateStars(selectedRating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            star.classList.toggle("active", star.dataset.value <= rating);
        });
    }

    document.getElementById("submitReview")?.addEventListener("click", async () => {
        if (!isLoggedIn) {
            alert("You must be logged in to leave a review.");
            return;
        }

        if (!selectedRating || !reviewText?.value.trim()) {
            alert("You cannot leave a review empty. Please provide a review.");
            return;
        }

        // Can now save to database then reload
        const res = await fetch("/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ org, rating: Number(selectedRating), comment: reviewText.value.trim() })
        });

        const data = await res.json();
        if (data.success) {
            selectedRating = 0;
            updateStars(0);
            reviewText.value = "";
            await loadReviews();
        }
    });

    // edit and save review
    let editingId = null;
    let editRating = 0;

    const editModal      = document.getElementById("editReviewModal");
    const editStars      = document.querySelectorAll("#editStarRating span");
    const editText       = document.getElementById("editReviewText");
    const saveEditBtn    = document.getElementById("saveEditReview");
    const cancelEditBtn  = document.getElementById("cancelEditReview");

    editStars.forEach(star => {
        star.addEventListener("click", () => {
            editRating = Number(star.dataset.value);
            editStars.forEach(s => s.classList.toggle("active", Number(s.dataset.value) <= editRating));
        });
    });

    function openEditModal(id, rating, comment) {
        editingId = id;
        editRating = rating;
        editText.value = comment;
        editStars.forEach(s => s.classList.toggle("active", Number(s.dataset.value) <= rating));
        editModal?.classList.remove("hidden");
    }

    cancelEditBtn?.addEventListener("click", () => editModal?.classList.add("hidden"));

    editModal?.addEventListener("click", (e) => {
        if (e.target === editModal) editModal.classList.add("hidden");
    });

    saveEditBtn?.addEventListener("click", async () => {
        if (!editingId || !editRating || !editText?.value.trim()) return;

        const res = await fetch(`/reviews/edit/${editingId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rating: editRating, comment: editText.value.trim() })
        });
        const data = await res.json();
        if (data.success) {
            editModal.classList.add("hidden");
            editingId = null;
            await loadReviews();
        }
    });

    function renderReviews() {
        if (!reviewsList) return;

        reviewsList.innerHTML = "";

        const filteredReviews = currentFilter === "all"
            ? reviews
            : reviews.filter(review => review.rating === Number(currentFilter));

        filteredReviews.forEach((review, i) => {
            const raw = rawReviews[i]; // match review object to its raw DB doc for _id

            const div = document.createElement("div");
            div.className = "review-item";

            div.innerHTML = `
                <strong>${review.user}</strong> • <span>${review.date}</span>
                <div class="review-stars">${"★".repeat(review.rating)}</div>
                <p>${review.comment}</p>
                ${session.userType === "admin" && raw ? `
                    <div class="review-actions">
                        <button class="edit-review-btn">Edit</button>
                        <button class="delete-review-btn">Delete</button>
                    </div>
                ` : ""}
            `;

            // admin edit and delete buttons
            div.querySelector(".edit-review-btn")?.addEventListener("click", () => {
                openEditModal(raw._id, review.rating, review.comment);
            });

            div.querySelector(".delete-review-btn")?.addEventListener("click", async () => {
                if (!confirm("Delete this review?")) return;
                const res = await fetch(`/reviews/delete/${raw._id}`, { method: "POST" });
                const data = await res.json();
                if (data.success) await loadReviews();
            });

            reviewsList.appendChild(div);
        });

        updateAverageRating();
    }

    function updateAverageRating() {
        const avgEl = document.getElementById("averageRating");
        const starsEl = document.getElementById("averageStars");
        const totalEl = document.getElementById("totalReviews");

        if (!avgEl || !starsEl || !totalEl) return;

        if (reviews.length === 0) {
            avgEl.textContent = "0.0";
            starsEl.innerHTML = "";
            totalEl.textContent = "(0 reviews)";
            return;
        }

        let total = 0;
        for (let i = 0; i < reviews.length; i++) {
            total += reviews[i].rating;
        }

        const average = (total / reviews.length).toFixed(1);

        avgEl.textContent = average;
        starsEl.innerHTML = "★".repeat(Math.round(average));
        totalEl.textContent = `(${reviews.length} reviews)`;
    }

    const filterButtons = document.querySelectorAll(".rating-filters button");
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.getAttribute("data-filter");
            renderReviews();
        });
    });

    // loads from database
    await loadReviews();
});