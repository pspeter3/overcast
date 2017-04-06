const content = (
    <form>
        <div class="cell">
            <input type="text" name="name" placeholder="Sombra"/>
            <label for="name">Name</label>
        </div>
        <div class="cell">
            <input type="number" name="power" min="0" max="10" placeholder="9000"/>
            <label for="power">Power</label>
        </div>
        <div class="cell">
            <select name="type">
                <option>Warrior</option>
            </select>
            <label for="type">Type</label>
        </div>
        <div class="cell">
            <textarea name="notes" placeholder="Hack The Planet"/>
            <label for="notes">Notes</label>
        </div>
    </form >
)

preact.render(content, document.body)
