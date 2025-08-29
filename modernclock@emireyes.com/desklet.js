const Desklet = imports.ui.desklet;
const St = imports.gi.St;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Settings = imports.ui.settings;
const Clutter = imports.gi.Clutter;

function MyDesklet(metadata, desklet_id) {
    this._init(metadata, desklet_id);
}

MyDesklet.prototype = {
    __proto__: Desklet.Desklet.prototype,

    _init: function(metadata, desklet_id) {
        Desklet.Desklet.prototype._init.call(this, metadata, desklet_id);
        this.settings = new Settings.DeskletSettings(this, metadata.uuid, desklet_id);
        this._bind_settings();
        this._build_ui();
        this._update_loop();
    },

    _bind_settings: function() {
        this.settings.bind("show-day", "showDay");
        this.settings.bind("day-font-size", "dayFontSize");
        this.settings.bind("day-letter-spacing", "dayLetterSpacing");
        this.settings.bind("day-font-color", "dayFontColor");

        this.settings.bind("show-date", "showDate");
        this.settings.bind("date-font-size", "dateFontSize");
        this.settings.bind("date-letter-spacing", "dateLetterSpacing");
        this.settings.bind("date-font-color", "dateFontColor");

        this.settings.bind("show-time", "showTime");
        this.settings.bind("time-font-size", "timeFontSize");
        this.settings.bind("time-letter-spacing", "timeLetterSpacing");
        this.settings.bind("time-font-color", "timeFontColor");
        this.settings.bind("use-24-hour-format", "use24h");
        this.settings.bind("time-character", "timeCharacter");
    },

    _build_ui: function() {
        
        this.container = new St.BoxLayout({
            vertical: true,
            x_expand: true,
            y_expand: true,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            clip_to_allocation: true
        });

        this.container.add_style_class_name("clock-container");

        let labelProps = {
            x_expand: true,
            y_expand: false,
            x_align: Clutter.ActorAlign.CENTER,
            y_align: Clutter.ActorAlign.CENTER,
            clip_to_allocation: false
        };

        this.dayLabel = new St.Label(labelProps);
        this.dateLabel = new St.Label(labelProps);
        this.timeLabel = new St.Label(labelProps);

        this.dayLabel.add_style_class_name("day-label");
        this.dateLabel.add_style_class_name("date-label");
        this.timeLabel.add_style_class_name("time-label");

        this.container.add_child(this.dayLabel);
        this.container.add_child(this.dateLabel);
        this.container.add_child(this.timeLabel);

        this.setContent(this.container);

        let parent = this.container.get_parent();
        if (parent) {
            parent.set_style("background-color: transparent; border: none; box-shadow: none; padding: 0; margin: 0;");
        }
        this._decorations = false;
        this.actor.set_style("background-color: transparent; border: none; box-shadow: none; padding: 0; margin: 0;");
    },

    _update_loop: function() {
        let now = new Date();
        let day = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        let gDate = GLib.DateTime.new_now_local();
        let date = `${gDate.get_day_of_month()} ${gDate.format("%B")} ${gDate.get_year()}`;
        let hours = this.use24h
            ? now.getHours().toString().padStart(2, "0")
            : (now.getHours() % 12 || 12).toString().padStart(2, "0");
        let minutes = now.getMinutes().toString().padStart(2, "0");
        let time = `${hours}${this.timeCharacter || ":"}${minutes}`;

        if (this.showDay) this.dayLabel.set_text(day);
        if (this.showDate) this.dateLabel.set_text(date);
        if (this.showTime) this.timeLabel.set_text(time);

        this.dayLabel.set_style(`font-family: 'Anurati'; font-size: ${this.dayFontSize}px; color: ${this.dayFontColor}; letter-spacing: ${this.dayLetterSpacing}px;`);
        this.dateLabel.set_style(`font-family: 'Poppins'; font-size: ${this.dateFontSize}px; color: ${this.dateFontColor}; letter-spacing: ${this.dateLetterSpacing}px;`);
        this.timeLabel.set_style(`font-family: 'Poppins'; font-size: ${this.timeFontSize}px; color: ${this.timeFontColor}; letter-spacing: ${this.timeLetterSpacing}px;`);

        this.dayLabel.queue_relayout();
        this.dateLabel.queue_relayout();
        this.timeLabel.queue_relayout();

        Mainloop.timeout_add_seconds(1, () => this._update_loop());
    }
};

function main(metadata, desklet_id) {
    return new MyDesklet(metadata, desklet_id);
}
